import { leaderboardApi } from "@/lib/api-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { cookies } from "next/headers";

async function getLeaderboards() {
  try {
    const [scoreLeaderboard, streakLeaderboard] = await Promise.all([
      leaderboardApi.getScoreLeaderboard(50),
      leaderboardApi.getStreakLeaderboard(50),
    ]);

    return { scoreLeaderboard, streakLeaderboard };
  } catch (error) {
    console.error("Failed to fetch leaderboards:", error);
    return { scoreLeaderboard: [], streakLeaderboard: [] };
  }
}

export default async function LeaderboardPage() {
  const { scoreLeaderboard, streakLeaderboard } = await getLeaderboards();

  // In a real app, you'd get the current user ID from the session/auth
  // For now, we'll leave it undefined since we're using localStorage auth
  const currentUserId = undefined;

  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other players
        </p>
      </div>

      <Tabs defaultValue="score" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="score">Top Scores</TabsTrigger>
          <TabsTrigger value="streak">Top Streaks</TabsTrigger>
        </TabsList>

        <TabsContent value="score">
          <Card>
            <CardHeader>
              <CardTitle>Top Players by Score</CardTitle>
              <CardDescription>
                The highest scoring players on BrainBolt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable
                entries={scoreLeaderboard}
                type="score"
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="streak">
          <Card>
            <CardHeader>
              <CardTitle>Top Players by Streak</CardTitle>
              <CardDescription>
                The longest answer streaks on BrainBolt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeaderboardTable
                entries={streakLeaderboard}
                type="streak"
                currentUserId={currentUserId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
