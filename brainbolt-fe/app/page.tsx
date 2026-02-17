import Link from "next/link";
import { Brain, Zap, Trophy, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { leaderboardApi } from "@/lib/api-client";
import { LeaderboardRow } from "@/components/leaderboard/leaderboard-row";

async function getTopPlayers() {
  try {
    const scoreLeaderboard = await leaderboardApi.getScoreLeaderboard(5);
    return scoreLeaderboard;
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const topPlayers = await getTopPlayers();

  return (
    <div className="flex flex-col w-full min-w-0">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/10 via-background to-background min-w-0">
        <div className="container px-4 py-24 sm:py-32 max-w-7xl">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Adaptive Learning Quiz Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
              Challenge Your Mind with{" "}
              <span className="text-primary">BrainBolt</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
              An intelligent quiz platform that adapts to your skill level. Answer
              questions, build streaks, and climb the leaderboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Get Started
                  <Brain className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 sm:py-24 min-w-0">
        <div className="container px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose BrainBolt?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience a quiz platform that grows with you
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Adaptive Difficulty</CardTitle>
              <CardDescription>
                Questions automatically adjust to your skill level, keeping you
                challenged but not frustrated
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Streak System</CardTitle>
              <CardDescription>
                Build winning streaks for bonus points. Every 5 correct answers
                increases your multiplier
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Trophy className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Global Leaderboard</CardTitle>
              <CardDescription>
                Compete with players worldwide. Track your rank by score or
                streak in real-time
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      {topPlayers.length > 0 && (
        <section className="w-full bg-muted/50 py-16 sm:py-24 min-w-0">
          <div className="container px-4 max-w-4xl">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Top Players
                </h2>
                <p className="text-muted-foreground">
                  See who's leading the pack this week
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Leaderboard</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {topPlayers.map((entry) => (
                    <LeaderboardRow
                      key={entry.user_id}
                      entry={entry}
                      type="score"
                    />
                  ))}
                </CardContent>
              </Card>

              <div className="text-center mt-6">
                <Button variant="outline" asChild>
                  <Link href="/leaderboard">View Full Leaderboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="w-full py-16 sm:py-24 min-w-0">
        <div className="container px-4 max-w-7xl">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of players already challenging themselves on BrainBolt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">Create Free Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

