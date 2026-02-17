"use client";

import React from "react";
import { cn, getDifficultyColor } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: number;
  className?: string;
}

export const DifficultyBadge = React.memo(function DifficultyBadge({
  difficulty,
  className,
}: DifficultyBadgeProps) {
  const roundedDiff = Math.round(difficulty);
  const color = getDifficultyColor(difficulty);

  return (
    <div
      className={cn(
        "inline-flex items-center border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider",
        className
      )}
      style={{ backgroundColor: color }}
    >
      Level {roundedDiff}
    </div>
  );
});
