"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Target, Flame, TrendingUp, Award } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AccuracyChart } from "@/components/dashboard/accuracy-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { quizApi } from "@/lib/api-client";
import type { QuizMetrics } from "@/types";
import { toast } from "sonner";
import { formatNumber, formatPercentage, getDifficultyLabel } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuthStore();
  const [metrics, setMetrics] = useState<QuizMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchMetrics = async () => {
      if (!token) return;

      try {
        const data = await quizApi.getMetrics(token);
        setMetrics(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load metrics");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [isAuthenticated, token, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl px-4 py-8 min-w-0">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 mb-8" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="container max-w-6xl px-4 py-8 min-w-0">
        <p className="text-center text-muted-foreground">
          No metrics available. Start playing to see your stats!
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl px-4 py-8 min-w-0">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your progress and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Score"
          value={formatNumber(metrics.total_score)}
          icon={Trophy}
          description="All-time points earned"
        />
        <StatsCard
          title="Current Streak"
          value={metrics.current_streak}
          icon={Flame}
          description={`Max: ${metrics.max_streak}`}
        />
        <StatsCard
          title="Accuracy"
          value={formatPercentage(metrics.accuracy)}
          icon={Target}
          description={`${metrics.correct_answers}/${metrics.total_questions_answered} correct`}
        />
        <StatsCard
          title="Current Difficulty"
          value={getDifficultyLabel(metrics.current_difficulty)}
          icon={TrendingUp}
          description={`Level ${Math.round(metrics.current_difficulty)}`}
        />
      </div>

      {/* Charts Grid */}
      <div className="mb-8">
        <AccuracyChart
          correctAnswers={metrics.correct_answers}
          totalQuestions={metrics.total_questions_answered}
        />
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Questions Answered"
          value={formatNumber(metrics.total_questions_answered)}
          icon={Award}
        />
        <StatsCard
          title="Max Streak"
          value={metrics.max_streak}
          icon={Flame}
          description="Longest answer streak"
        />
        <StatsCard
          title="Correct Answers"
          value={formatNumber(metrics.correct_answers)}
          icon={Target}
        />
      </div>
    </div>
  );
}
