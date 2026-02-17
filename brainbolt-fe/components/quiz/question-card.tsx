"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DifficultyBadge } from "./difficulty-badge";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  questionText: string;
  difficulty: number;
  className?: string;
}

export const QuestionCard = React.memo(function QuestionCard({
  questionText,
  difficulty,
  className,
}: QuestionCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-xl sm:text-2xl font-semibold leading-tight flex-1">
              {questionText}
            </h2>
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
