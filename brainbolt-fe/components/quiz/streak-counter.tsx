"use client";

import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streak: number;
  className?: string;
}

export const StreakCounter = React.memo(function StreakCounter({
  streak,
  className,
}: StreakCounterProps) {
  const multiplier = Math.floor(streak / 5);
  const hasBonus = multiplier > 0;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-1">
        <Flame
          className={cn(
            "h-5 w-5 transition-colors",
            streak > 0 ? "text-orange-500" : "text-muted-foreground"
          )}
        />
        <span className="text-lg font-bold">{streak}</span>
      </div>
      {hasBonus && (
        <span className="text-xs font-medium text-orange-500">
          +{multiplier}× bonus
        </span>
      )}
    </div>
  );
});
