"use client";

import React from "react";
import { LeaderboardRow } from "./leaderboard-row";
import type { LeaderboardEntry } from "@/types";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  type: "score" | "streak";
  currentUserId?: string;
}

export function LeaderboardTable({
  entries,
  type,
  currentUserId,
}: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No entries yet. Be the first to play!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <LeaderboardRow
          key={entry.user_id}
          entry={entry}
          type={type}
          isCurrentUser={entry.user_id === currentUserId}
        />
      ))}
    </div>
  );
}
