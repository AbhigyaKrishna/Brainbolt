"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { ScoreDisplay } from "./score-display";
import { StreakCounter } from "./streak-counter";
import { DifficultyBadge } from "./difficulty-badge";

interface QuizHeaderProps {
  score: number;
  streak: number;
  difficulty: number;
}

export function QuizHeader({ score, streak, difficulty }: QuizHeaderProps) {
  return (
    <div className="w-full bg-card border-b">
      <div className="container px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Score</p>
              <ScoreDisplay score={score} />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Streak</p>
            <StreakCounter streak={streak} />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>
      </div>
    </div>
  );
}
