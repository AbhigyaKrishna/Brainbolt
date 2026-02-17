import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/error-handler';
import { cacheService } from './cache.service';
import { adaptiveService } from './adaptive.service';
import { scoreService } from './score.service';
import { QuestionResponse, AnswerResultResponse, UserStatsResponse } from '../schemas/quiz.schema';
import { redis } from '../lib/redis';

const INACTIVITY_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

export class QuizService {
  /**
   * Get next question for user
   */
  async getNextQuestion(userId: string): Promise<QuestionResponse> {
    // Get or create user state
    let userState = await prisma.userState.findUnique({
      where: { userId },
    });

    if (!userState) {
      throw new AppError(404, 'User state not found');
    }

    // Check for inactivity (reset streak if > 30 min)
    if (userState.lastAnsweredAt) {
      const timeSinceLastAnswer = Date.now() - userState.lastAnsweredAt.getTime();
      if (timeSinceLastAnswer > INACTIVITY_THRESHOLD_MS && userState.streak > 0) {
        userState = await prisma.userState.update({
          where: { userId },
          data: { streak: 0 },
        });
      }
    }

    // Get difficulty range
    const [minDiff, maxDiff] = adaptiveService.getDifficultyRange(userState.currentDifficulty);

    // Try to get questions from cache or DB
    let question = await this.selectQuestion(userId, minDiff, maxDiff);

    // If no question found in range, expand search
    if (!question) {
      question = await this.selectQuestion(userId, 1, 10);
    }

    if (!question) {
      throw new AppError(404, 'No questions available');
    }

    // Create or update quiz session
    await prisma.quizSession.upsert({
      where: {
        id: `${userId}_current`,
      },
      create: {
        id: `${userId}_current`,
        userId,
        currentQuestionId: question.id,
      },
      update: {
        currentQuestionId: question.id,
      },
    });

    return {
      question_id: question.id,
      prompt: question.prompt,
      choices: question.choices,
      difficulty: question.difficulty,
      state_version: userState.stateVersion,
    };
  }

  /**
   * Submit answer and update state
   */
  async submitAnswer(
    userId: string,
    choiceIndex: number,
    stateVersion: number,
    idempotencyKey?: string
  ): Promise<AnswerResultResponse> {
    // Check idempotency if key provided
    if (idempotencyKey) {
      const cached = await cacheService.checkIdempotency(idempotencyKey);
      if (cached) {
        return cached;
      }
    }

    // Get current session
    const session = await prisma.quizSession.findUnique({
      where: { id: `${userId}_current` },
      include: { currentQuestion: true },
    });

    if (!session || !session.currentQuestion) {
      throw new AppError(400, 'No active question');
    }

    const question = session.currentQuestion;

    // Process answer in transaction with optimistic locking
    const result = await prisma.$transaction(async (tx: any) => {
      // Get user state with lock
      const userState = await tx.userState.findUnique({
        where: { userId },
      });

      if (!userState) {
        throw new AppError(404, 'User state not found');
      }

      // Check state version (optimistic lock)
      if (userState.stateVersion !== stateVersion) {
        throw new AppError(409, 'State version mismatch - please fetch the latest question');
      }

      const correct = choiceIndex === question.correctIndex;

      // Calculate new values
      let newStreak = correct ? userState.streak + 1 : 0;
      const newMaxStreak = Math.max(newStreak, userState.maxStreak);

      const scoreDelta = correct
        ? scoreService.calculateScoreDelta(userState.currentDifficulty, userState.streak)
        : 0;
      const newTotalScore = userState.totalScore + scoreDelta;

      // Adjust difficulty
      const adaptiveState = correct
        ? adaptiveService.adjustOnCorrect({
            currentDifficulty: userState.currentDifficulty,
            momentum: userState.momentum,
          })
        : adaptiveService.adjustOnWrong({
            currentDifficulty: userState.currentDifficulty,
            momentum: userState.momentum,
          });

      // Update user state
      await tx.userState.update({
        where: { userId },
        data: {
          currentDifficulty: adaptiveState.currentDifficulty,
          momentum: adaptiveState.momentum,
          streak: newStreak,
          maxStreak: newMaxStreak,
          totalScore: newTotalScore,
          stateVersion: userState.stateVersion + 1,
          lastAnsweredAt: new Date(),
        },
      });

      // Create answer log
      await tx.answerLog.create({
        data: {
          idempotencyKey: idempotencyKey || `${userId}_${question.id}_${Date.now()}`,
          userId,
          sessionId: session.id,
          questionId: question.id,
          choiceIndex,
          correct,
          scoreDelta,
          streakAtAnswer: userState.streak,
        },
      });

      // Update leaderboard entries
      await tx.leaderboardScore.update({
        where: { userId },
        data: { totalScore: newTotalScore },
      });

      await tx.leaderboardStreak.update({
        where: { userId },
        data: { maxStreak: newMaxStreak },
      });

      return {
        correct,
        correct_index: question.correctIndex,
        explanation: question.explanation,
        score_delta: scoreDelta,
        new_total_score: newTotalScore,
        new_streak: newStreak,
        new_difficulty: adaptiveState.currentDifficulty,
      };
    });

    // Update Redis leaderboards
    await this.updateRedisLeaderboards(userId, result.new_total_score, result.new_streak);

    // Invalidate user state cache
    await cacheService.invalidateUserState(userId);

    // Cache result for idempotency
    if (idempotencyKey) {
      await cacheService.setIdempotency(idempotencyKey, result);
    }

    return result;
  }

  /**
   * Get user stats
   */
  async getUserStats(userId: string): Promise<UserStatsResponse> {
    const userState = await prisma.userState.findUnique({
      where: { userId },
    });

    if (!userState) {
      throw new AppError(404, 'User state not found');
    }

    const answerLogs = await prisma.answerLog.findMany({
      where: { userId },
    });

    const totalAnswered = answerLogs.length;
    const correctAnswers = answerLogs.filter((log: any) => log.correct).length;
    const accuracy = totalAnswered > 0 ? (correctAnswers / totalAnswered) * 100 : 0;

    return {
      total_score: userState.totalScore,
      current_streak: userState.streak,
      max_streak: userState.maxStreak,
      current_difficulty: userState.currentDifficulty,
      total_questions_answered: totalAnswered,
      correct_answers: correctAnswers,
      accuracy: Math.round(accuracy * 10) / 10,
    };
  }

  /**
   * Select a question from the given difficulty range
   */
  private async selectQuestion(userId: string, minDiff: number, maxDiff: number) {
    // Get recently answered question IDs (avoid repeats)
    const recentAnswers = await prisma.answerLog.findMany({
      where: { userId },
      orderBy: { answeredAt: 'desc' },
      take: 20,
      select: { questionId: true },
    });

    const excludeIds = recentAnswers.map((a: any) => a.questionId);

    // Find questions in difficulty range
    const questions = await prisma.question.findMany({
      where: {
        difficulty: {
          gte: minDiff,
          lte: maxDiff,
        },
        id: {
          notIn: excludeIds,
        },
      },
      take: 10,
    });

    if (questions.length === 0) {
      return null;
    }

    // Random selection
    return questions[Math.floor(Math.random() * questions.length)];
  }

  /**
   * Update Redis leaderboards
   */
  private async updateRedisLeaderboards(userId: string, totalScore: number, maxStreak: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });

      if (user) {
        await redis.zadd('leaderboard:score', totalScore, userId);
        await redis.zadd('leaderboard:streak', maxStreak, userId);
      }
    } catch (error) {
      console.error('Failed to update Redis leaderboards:', error);
    }
  }
}

export const quizService = new QuizService();
