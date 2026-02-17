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
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white",
        className
      )}
      style={{ backgroundColor: color }}
    >
      Level {roundedDiff}
    </div>
  );
});
