"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/quiz/question-card";
import { ChoiceList } from "@/components/quiz/choice-list";
import { AnswerFeedback } from "@/components/quiz/answer-feedback";
import { QuizHeader } from "@/components/quiz/quiz-header";
import { QuizSkeleton } from "@/components/quiz/quiz-skeleton";
import { useAuthStore } from "@/store/auth-store";
import { useQuizStore } from "@/store/quiz-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function QuizPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const {
    currentQuestion,
    selectedAnswer,
    answerResult,
    score,
    streak,
    difficulty,
    isSubmitting,
    isLoading,
    error,
    setSelectedAnswer,
    fetchNextQuestion,
    submitAnswer,
  } = useQuizStore();

  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!currentQuestion && !isLoading && token) {
      fetchNextQuestion(token);
    }
  }, [isAuthenticated, currentQuestion, isLoading, token, router, fetchNextQuestion]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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

  const handleSubmit = async () => {
    if (!token || selectedAnswer === null || answerResult) return;

    await submitAnswer(token);
  };

  const handleNextQuestion = async () => {
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }

    if (!token) return;
    await fetchNextQuestion(token);
  };

  const handleSelectChoice = (index: number) => {
    if (answerResult) return;
    setSelectedAnswer(index);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full min-w-0">
      <QuizHeader score={score} streak={streak} difficulty={difficulty} />

      <div className="container max-w-3xl px-4 py-8 min-w-0">
        {isLoading && !currentQuestion ? (
          <QuizSkeleton />
        ) : currentQuestion ? (
          <div className="flex flex-col gap-6">
            <QuestionCard
              questionText={currentQuestion.prompt}
              difficulty={currentQuestion.difficulty}
            />

            <ChoiceList
              choices={currentQuestion.choices}
              selectedAnswer={selectedAnswer}
              correctAnswer={
                answerResult ? answerResult.correct_index : null
              }
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
                explanation={answerResult.explanation}
                onNext={handleNextQuestion}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No question available. Please try again.
            </p>
            <Button
              onClick={() => token && fetchNextQuestion(token)}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
