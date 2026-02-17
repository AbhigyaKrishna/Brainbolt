"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function QuizSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Question Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Choices */}
      <div className="grid gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>

      {/* Submit Button */}
      <Skeleton className="h-12 w-full sm:w-32 rounded-md" />
    </div>
  );
}
