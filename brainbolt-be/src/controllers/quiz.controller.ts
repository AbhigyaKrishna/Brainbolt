import { Request, Response, NextFunction } from 'express';
import { quizService } from '../services/quiz.service';
import { SubmitAnswerRequest } from '../schemas/quiz.schema';

export class QuizController {
  async getNextQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const question = await quizService.getNextQuestion(req.user!.id);
      res.status(200).json(question);
    } catch (error) {
      next(error);
    }
  }

  async submitAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const { choice_index, state_version } = req.body as SubmitAnswerRequest;
      const idempotencyKey = req.headers['idempotency-key'] as string | undefined;

      const result = await quizService.submitAnswer(
        req.user!.id,
        choice_index,
        state_version,
        idempotencyKey
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await quizService.getUserStats(req.user!.id);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const quizController = new QuizController();
