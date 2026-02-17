"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnswerFeedbackProps {
  isCorrect: boolean;
  scoreDelta: number;
  explanation?: string;
  onNext: () => void;
}

export const AnswerFeedback = React.memo(function AnswerFeedback({
  isCorrect,
  scoreDelta,
  explanation,
  onNext,
}: AnswerFeedbackProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "border-2 p-6 shadow-[4px_4px_0_0_hsl(var(--foreground))]",
        isCorrect
          ? "border-success bg-success/10"
          : "border-destructive bg-destructive/10"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle2 className="h-8 w-8 text-success" />
          ) : (
            <XCircle className="h-8 w-8 text-destructive" />
          )}
          <div className="flex-1">
            <h3 className="text-xl font-bold">
              {isCorrect ? "Correct!" : "Incorrect"}
            </h3>
            <p
              className={cn(
                "text-lg font-semibold",
                isCorrect ? "text-success" : "text-destructive"
              )}
            >
              {scoreDelta >= 0 ? "+" : ""}
              {scoreDelta} points
            </p>
          </div>
        </div>

        {explanation && (
          <div className="text-sm text-muted-foreground border-2 border-foreground bg-background p-3">
            <p className="font-bold mb-1">Explanation:</p>
            <p>{explanation}</p>
          </div>
        )}

        <Button onClick={onNext} size="lg" className="w-full sm:w-auto">
          Next Question
        </Button>
      </div>
    </motion.div>
  );
});
