import Link from "next/link";
import { Brain, Zap, Trophy, Target, Clock } from "lucide-react";
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
      {/* Hero Section - Split Layout */}
      <section className="w-full bg-secondary/40 dark:bg-card min-w-0 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-[600px] items-center">
            {/* Left Content */}
            <div className="flex-1 px-6 sm:px-12 py-16 sm:py-24 lg:py-0 flex flex-col justify-center">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-8 text-foreground">
                MASTER YOUR KNOWLEDGE.
                <br />
                RISE TO GREATNESS.
              </h1>
              
              <p className="text-lg leading-relaxed mb-8 max-w-md text-muted-foreground">
                An adaptive quiz platform that challenges your mind and rewards your progress. Answer questions, build winning streaks, and climb the global leaderboard to prove your excellence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  asChild
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-3 border-2 border-foreground shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all"
                >
                  <Link href="/auth/register">
                    START QUIZ NOW
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="neutral" 
                  asChild
                  className="font-bold text-lg px-8 py-3"
                >
                  <Link href="/leaderboard">
                    VIEW LEADERBOARD
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Visual */}
            <div className="flex-1 px-6 sm:px-12 py-16 sm:py-24 lg:py-0 flex items-center justify-center relative">
              <div className="relative w-full max-w-sm">
                {/* Placeholder for visual - Quiz App Icon */}
                <div className="bg-gradient-to-br from-primary via-accent to-primary aspect-square flex items-center justify-center border-4 border-foreground shadow-[8px_8px_0_0_hsl(var(--foreground))]">
                  <Brain className="w-32 h-32 text-background" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="w-full py-16 sm:py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Updates Card */}
            <div className="border-4 border-foreground bg-warning dark:bg-warning/90 p-8 shadow-[6px_6px_0_0_hsl(var(--foreground))]">
              <div className="text-sm font-bold text-warning-foreground mb-3 uppercase">Recent Updates</div>
              <h3 className="text-2xl font-black text-warning-foreground mb-4">
                ADAPTIVE LEARNING ENGINE
              </h3>
              <p className="text-warning-foreground/90 dark:text-warning-foreground/95 mb-6">
                Our AI-powered system adjusts question difficulty based on your performance in real-time. Keep challenging, keep improving, keep winning.
              </p>
              <Link href="#" className="text-warning-foreground font-bold underline hover:no-underline inline-flex items-center gap-1">
                Learn more →
              </Link>
            </div>

            {/* Events Card */}
            <div className="border-4 border-foreground bg-accent dark:bg-accent/90 p-8 shadow-[6px_6px_0_0_hsl(var(--foreground))]">
              <div className="text-sm font-bold text-accent-foreground mb-3 uppercase">Events</div>
              <h3 className="text-2xl font-black text-accent-foreground mb-4">
                MONTHLY QUIZ CHAMPIONSHIP
              </h3>
              <p className="text-accent-foreground/90 dark:text-accent-foreground/95 mb-2">
                <span className="font-bold">Next Event:</span> March 1st, 2026
              </p>
              <p className="text-accent-foreground/90 dark:text-accent-foreground/95 mb-6">
                Compete with top players for exclusive prizes and global recognition on our leaderboard.
              </p>
              <Link href="/leaderboard" className="text-accent-foreground font-bold underline hover:no-underline inline-flex items-center gap-1">
                Get updated →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 sm:py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black text-center mb-16 text-foreground">
            WHY CHOOSE BRAINBOLT?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="border-3 border-foreground p-8 bg-card hover:bg-muted transition-colors shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Target className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-black text-card-foreground mb-3">Adaptive Difficulty</h3>
              <p className="text-muted-foreground">
                Questions adjust to your skill level instantly. Stay challenged, never frustrated.
              </p>
            </div>

            <div className="border-3 border-foreground p-8 bg-card hover:bg-muted transition-colors shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-black text-card-foreground mb-3">Streak System</h3>
              <p className="text-muted-foreground">
                Build winning streaks for bonus points. Every 5 correct answers boost your multiplier.
              </p>
            </div>

            <div className="border-3 border-foreground p-8 bg-card hover:bg-muted transition-colors shadow-[4px_4px_0_0_hsl(var(--foreground))]">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-black text-card-foreground mb-3">Global Leaderboard</h3>
              <p className="text-muted-foreground">
                Compete with players worldwide. Track your rank in real-time and dominate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Preview Section */}
      {topPlayers.length > 0 && (
        <section className="w-full py-16 sm:py-24 px-4 bg-secondary/30 dark:bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-black text-center mb-12 text-foreground">
              TOP PLAYERS THIS WEEK
            </h2>

            <Card className="border-4 border-foreground shadow-[6px_6px_0_0_hsl(var(--foreground))] bg-card">
              <CardHeader className="border-b-4 border-foreground bg-card">
                <CardTitle className="text-2xl font-black text-foreground">Leaderboard</CardTitle>
                <CardDescription>See who's dominating the competition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-6 bg-card">
                {topPlayers.map((entry) => (
                  <LeaderboardRow
                    key={entry.user_id}
                    entry={entry}
                    type="score"
                  />
                ))}
              </CardContent>
            </Card>

            <div className="text-center mt-8">
              <Button 
                size="lg" 
                asChild
                className="font-bold text-lg px-8 py-3 border-2 border-foreground bg-background hover:bg-muted shadow-[4px_4px_0_0_hsl(var(--foreground))] hover:shadow-[2px_2px_0_0_hsl(var(--foreground))] transition-all"
              >
                <Link href="/leaderboard">View Full Leaderboard</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Final CTA Section */}
      <section className="w-full py-16 sm:py-24 px-4 bg-primary">
        <div className="max-w-4xl mx-auto">
          <div className="border-4 border-primary-foreground bg-primary/20 dark:bg-primary/10 text-primary-foreground p-12 text-center shadow-[8px_8px_0_0_hsla(var(--primary-foreground),0.3)]">
            <h2 className="text-4xl sm:text-5xl font-black mb-6">
              READY TO CHALLENGE YOURSELF?
            </h2>
            <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
              Join thousands of brilliant minds testing their knowledge on BrainBolt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold text-lg px-8 py-3 border-2 border-primary-foreground shadow-[4px_4px_0_0_hsla(var(--primary-foreground),0.5)] hover:shadow-[2px_2px_0_0_hsla(var(--primary-foreground),0.5)] transition-all"
              >
                <Link href="/auth/register">Create Account</Link>
              </Button>
              <Button
                size="lg"
                className="bg-background hover:bg-muted text-foreground font-bold text-lg px-8 py-3 border-2 border-primary-foreground shadow-[4px_4px_0_0_hsla(var(--foreground),0.3)] hover:shadow-[2px_2px_0_0_hsla(var(--foreground),0.3)] transition-all"
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

