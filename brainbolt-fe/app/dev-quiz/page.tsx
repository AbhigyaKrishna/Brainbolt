"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/quiz/question-card";
import { ChoiceList } from "@/components/quiz/choice-list";
import { AnswerFeedback } from "@/components/quiz/answer-feedback";
import { QuizHeader } from "@/components/quiz/quiz-header";
import { QuizSkeleton } from "@/components/quiz/quiz-skeleton";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Question, AnswerResult } from "@/types";

// Dummy quiz data for development
const DUMMY_QUESTIONS: Question[] = [
  {
    question_id: "dev-q1",
    prompt: "What is the capital of France?",
    choices: ["London", "Berlin", "Paris", "Madrid"],
    difficulty: 1,
    state_version: 1,
  },
  {
    question_id: "dev-q2",
    prompt: "Which planet is known as the Red Planet?",
    choices: ["Venus", "Mars", "Jupiter", "Saturn"],
    difficulty: 2,
    state_version: 2,
  },
  {
    question_id: "dev-q3",
    prompt: "What is the largest ocean on Earth?",
    choices: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    difficulty: 2,
    state_version: 3,
  },
  {
    question_id: "dev-q4",
    prompt: "Who wrote 'Romeo and Juliet'?",
    choices: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    difficulty: 1,
    state_version: 4,
  },
  {
    question_id: "dev-q5",
    prompt: "What is the speed of light in vacuum?",
    choices: ["299,792 km/s", "150,000 km/s", "500,000 km/s", "100,000 km/s"],
    difficulty: 3,
    state_version: 5,
  },
];

const CORRECT_ANSWERS = [2, 1, 3, 1, 0]; // Correct choice indices for each question

export default function DevQuizPage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Redirect to home in production
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      router.push("/");
    }
  }, [router]);

  // Auto-advance after answer
  useEffect(() => {
    if (answerResult && autoAdvanceTimer === null) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 3000);
      setAutoAdvanceTimer(timer);
    }

    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [answerResult]);

  // Don't render in production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const currentQuestion = DUMMY_QUESTIONS[currentQuestionIndex];
  const correctAnswerIndex = CORRECT_ANSWERS[currentQuestionIndex];

  const handleSubmit = async () => {
    if (selectedAnswer === null || answerResult) return;

    setIsSubmitting(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isCorrect = selectedAnswer === correctAnswerIndex;
    const newStreak = isCorrect ? streak + 1 : 0;
    const scoreDelta = isCorrect ? currentQuestion.difficulty * 10 : 0;
    const newScore = score + scoreDelta;

    const result: AnswerResult = {
      correct: isCorrect,
      correct_index: correctAnswerIndex,
      score_delta: scoreDelta,
      new_streak: newStreak,
      new_total_score: newScore,
      new_difficulty: currentQuestion.difficulty,
      explanation: isCorrect
        ? "Great job! That's correct!"
        : "Not quite right. Better luck next time!",
    };

    setAnswerResult(result);
    setScore(newScore);
    setStreak(newStreak);
    setIsSubmitting(false);

    if (isCorrect) {
      toast.success("Correct! 🎉");
    } else {
      toast.error("Incorrect");
    }
  };

  const handleNextQuestion = async () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    setIsTransitioning(true);
    
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const nextIndex = (currentQuestionIndex + 1) % DUMMY_QUESTIONS.length;
    setCurrentQuestionIndex(nextIndex);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setIsTransitioning(false);
  };

  const handleSelectChoice = (index: number) => {
    if (answerResult) return;
    setSelectedAnswer(index);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full min-w-0 flex flex-col">
      <QuizHeader score={score} streak={streak} difficulty={currentQuestion.difficulty} />
      
      {/* Dev mode indicator */}
      <div className="bg-yellow-500 text-black text-center py-2 font-bold">
        🛠️ DEV MODE - Using Dummy Data
      </div>

      <div className="container max-w-3xl px-4 py-8 min-w-0 mx-auto flex-1 flex items-center justify-center">
        {isTransitioning ? (
          <QuizSkeleton />
        ) : (
        <div className="flex flex-col gap-6 w-full">
          <QuestionCard
            questionText={currentQuestion.prompt}
            difficulty={currentQuestion.difficulty}
          />

          <ChoiceList
            choices={currentQuestion.choices}
            selectedAnswer={selectedAnswer}
            correctAnswer={answerResult ? answerResult.correct_index : null}
            isDisabled={!!answerResult || isSubmitting}
            onSelectChoice={handleSelectChoice}
          />

          {!answerResult && (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null || isSubmitting}
              size="lg"
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Answer"
              )}
            </Button>
          )}

          {answerResult && (
            <AnswerFeedback
              isCorrect={answerResult.correct}
              scoreDelta={answerResult.score_delta}
              explanation={answerResult.explanation || undefined}
              onNext={handleNextQuestion}
            />
          )}

          {/* Dev controls */}
          <div className="mt-4 p-4 bg-muted rounded-lg border-2 border-dashed">
            <p className="text-sm font-semibold mb-2">Dev Controls:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="neutral"
                size="sm"
                onClick={() => {
                  setScore(0);
                  setStreak(0);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswer(null);
                  setAnswerResult(null);
                  toast.info("Quiz reset");
                }}
              >
                Reset Quiz
              </Button>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => {
                  setScore(score + 100);
                  toast.info("Added 100 points");
                }}
              >
                +100 Score
              </Button>
              <Button
                variant="neutral"
                size="sm"
                onClick={() => {
                  setStreak(streak + 5);
                  toast.info("Added 5 to streak");
                }}
              >
                +5 Streak
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Question {currentQuestionIndex + 1} of {DUMMY_QUESTIONS.length}
            </p>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
