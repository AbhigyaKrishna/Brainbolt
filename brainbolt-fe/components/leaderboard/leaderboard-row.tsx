"use client";

import React from "react";
import { Trophy, Medal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { LeaderboardEntry } from "@/types";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RankBadgeProps {
  rank: number;
}

function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return <Trophy className="h-5 w-5 text-yellow-500" />;
  }
  if (rank === 2) {
    return <Medal className="h-5 w-5 text-gray-400" />;
  }
  if (rank === 3) {
    return <Medal className="h-5 w-5 text-orange-600" />;
  }
  return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
}

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
  type: "score" | "streak";
  isCurrentUser?: boolean;
}

export const LeaderboardRow = React.memo(function LeaderboardRow({
  entry,
  type,
  isCurrentUser = false,
}: LeaderboardRowProps) {
  const value = type === "score" ? entry.score : entry.streak;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg transition-colors",
        isCurrentUser
          ? "bg-primary/10 border-2 border-primary"
          : "bg-card hover:bg-accent/50"
      )}
    >
      <div className="flex items-center justify-center w-10">
        <RankBadge rank={entry.rank} />
      </div>

      <Avatar className="h-10 w-10">
        <AvatarFallback>
          {entry.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">
          {entry.username}
          {isCurrentUser && (
            <span className="ml-2 text-xs text-primary">(You)</span>
          )}
        </p>
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold">{formatNumber(value || 0)}</p>
        <p className="text-xs text-muted-foreground">
          {type === "score" ? "points" : "streak"}
        </p>
      </div>
    </div>
  );
});
