"use client";

import React from "react";
import { ChoiceButton } from "./choice-button";

interface ChoiceListProps {
  choices: string[];
  selectedAnswer: number | null;
  correctAnswer: number | null;
  isDisabled: boolean;
  onSelectChoice: (index: number) => void;
}

export const ChoiceList = React.memo(function ChoiceList({
  choices,
  selectedAnswer,
  correctAnswer,
  isDisabled,
  onSelectChoice,
}: ChoiceListProps) {
  return (
    <div className="grid gap-3">
      {choices.map((choice, index) => {
        const isSelected = selectedAnswer === index;
        const isCorrect = correctAnswer !== null && index === correctAnswer;
        const isIncorrect =
          correctAnswer !== null && isSelected && index !== correctAnswer;

        return (
          <ChoiceButton
            key={index}
            choice={choice}
            index={index}
            isSelected={isSelected}
            isCorrect={isCorrect}
            isIncorrect={isIncorrect}
            isDisabled={isDisabled}
            onClick={() => onSelectChoice(index)}
          />
        );
      })}
    </div>
  );
});
