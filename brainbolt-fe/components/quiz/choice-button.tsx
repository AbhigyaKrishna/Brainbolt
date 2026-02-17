"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChoiceButtonProps {
  choice: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isIncorrect: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const ChoiceButton = React.memo(function ChoiceButton({
  choice,
  index,
  isSelected,
  isCorrect,
  isIncorrect,
  isDisabled,
  onClick,
}: ChoiceButtonProps) {
  const labels = ["A", "B", "C", "D"];

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "w-full p-4 border-2 border-foreground text-left transition-all duration-200 font-medium",
        "shadow-[4px_4px_0_0_hsl(var(--foreground))]",
        "hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5",
        "active:shadow-none active:translate-x-1 active:translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "disabled:cursor-not-allowed",
        isSelected && !isCorrect && !isIncorrect && "border-2 border-foreground bg-primary text-primary-foreground",
        isCorrect && "border-2 border-success bg-success text-success-foreground",
        isIncorrect && "border-2 border-destructive bg-destructive text-destructive-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center border-2 font-bold",
            isSelected && !isCorrect && !isIncorrect && "border-foreground bg-primary text-primary-foreground",
            isCorrect && "border-success bg-success text-success-foreground",
            isIncorrect && "border-destructive bg-destructive text-destructive-foreground",
            !isSelected && !isCorrect && !isIncorrect && "border-foreground"
          )}
        >
          {isCorrect ? (
            <Check className="h-4 w-4" />
          ) : isIncorrect ? (
            <X className="h-4 w-4" />
          ) : (
            labels[index]
          )}
        </div>
        <span className="text-base sm:text-lg flex-1">{choice}</span>
      </div>
    </button>
  );
});
