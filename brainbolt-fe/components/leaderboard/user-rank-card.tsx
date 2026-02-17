"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { Trophy } from "lucide-react";

interface UserRankCardProps {
  rank: number;
  value: number;
  type: "score" | "streak";
}

export function UserRankCard({ rank, value, type }: UserRankCardProps) {
  return (
    <Card className="border-primary">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-bold">#{rank}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {type === "score" ? "Score" : "Streak"}
            </p>
            <p className="text-2xl font-bold">{formatNumber(value)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
