import { redis } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { ScoreEntry, StreakEntry } from '../schemas/leaderboard.schema';

export class LeaderboardService {
  /**
   * Get top scores leaderboard
   */
  async getScoreLeaderboard(limit: number = 100): Promise<ScoreEntry[]> {
    try {
      // Try Redis first
      const redisEntries = await redis.zrevrange('leaderboard:score', 0, limit - 1, 'WITHSCORES');

      if (redisEntries && redisEntries.length > 0) {
        return await this.formatScoreEntriesFromRedis(redisEntries);
      }

      // Fallback to database
      return await this.getScoreLeaderboardFromDB(limit);
    } catch (error) {
      console.error('Leaderboard error, falling back to DB:', error);
      return await this.getScoreLeaderboardFromDB(limit);
    }
  }

  /**
   * Get top streaks leaderboard
   */
  async getStreakLeaderboard(limit: number = 100): Promise<StreakEntry[]> {
    try {
      // Try Redis first
      const redisEntries = await redis.zrevrange('leaderboard:streak', 0, limit - 1, 'WITHSCORES');

      if (redisEntries && redisEntries.length > 0) {
        return await this.formatStreakEntriesFromRedis(redisEntries);
      }

      // Fallback to database
      return await this.getStreakLeaderboardFromDB(limit);
    } catch (error) {
      console.error('Leaderboard error, falling back to DB:', error);
      return await this.getStreakLeaderboardFromDB(limit);
    }
  }

  /**
   * Rebuild Redis leaderboards from database (cold start)
   */
  async rebuildRedisLeaderboards(): Promise<void> {
    try {
      // Rebuild score leaderboard
      const scoreEntries = await prisma.leaderboardScore.findMany({
        orderBy: { totalScore: 'desc' },
        take: 1000,
      });

      if (scoreEntries.length > 0) {
        const scoreArgs: (string | number)[] = [];
        scoreEntries.forEach((entry: any) => {
          scoreArgs.push(entry.totalScore, entry.userId);
        });
        await redis.zadd('leaderboard:score', ...scoreArgs);
      }

      // Rebuild streak leaderboard
      const streakEntries = await prisma.leaderboardStreak.findMany({
        orderBy: { maxStreak: 'desc' },
        take: 1000,
      });

      if (streakEntries.length > 0) {
        const streakArgs: (string | number)[] = [];
        streakEntries.forEach((entry: any) => {
          streakArgs.push(entry.maxStreak, entry.userId);
        });
        await redis.zadd('leaderboard:streak', ...streakArgs);
      }

      console.log('Redis leaderboards rebuilt successfully');
    } catch (error) {
      console.error('Failed to rebuild Redis leaderboards:', error);
    }
  }

  /**
   * Get user rank in score leaderboard
   */
  async getUserScoreRank(userId: string): Promise<number | null> {
    try {
      const rank = await redis.zrevrank('leaderboard:score', userId);
      return rank !== null ? rank + 1 : null;
    } catch (error) {
      console.error('Failed to get user rank:', error);
      return null;
    }
  }

  /**
   * Get user rank in streak leaderboard
   */
  async getUserStreakRank(userId: string): Promise<number | null> {
    try {
      const rank = await redis.zrevrank('leaderboard:streak', userId);
      return rank !== null ? rank + 1 : null;
    } catch (error) {
      console.error('Failed to get user rank:', error);
      return null;
    }
  }

  // Private helper methods

  private async formatScoreEntriesFromRedis(redisEntries: string[]): Promise<ScoreEntry[]> {
    const entries: ScoreEntry[] = [];

    for (let i = 0; i < redisEntries.length; i += 2) {
      const userId = redisEntries[i];
      const score = parseInt(redisEntries[i + 1], 10);

      // Get username from DB
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });

      if (user) {
        entries.push({
          rank: Math.floor(i / 2) + 1,
          user_id: userId,
          username: user.username,
          total_score: score,
        });
      }
    }

    return entries;
  }

  private async formatStreakEntriesFromRedis(redisEntries: string[]): Promise<StreakEntry[]> {
    const entries: StreakEntry[] = [];

    for (let i = 0; i < redisEntries.length; i += 2) {
      const userId = redisEntries[i];
      const streak = parseInt(redisEntries[i + 1], 10);

      // Get username from DB
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });

      if (user) {
        entries.push({
          rank: Math.floor(i / 2) + 1,
          user_id: userId,
          username: user.username,
          max_streak: streak,
        });
      }
    }

    return entries;
  }

  private async getScoreLeaderboardFromDB(limit: number): Promise<ScoreEntry[]> {
    const entries = await prisma.leaderboardScore.findMany({
      orderBy: { totalScore: 'desc' },
      take: limit,
    });

    return entries.map((entry: any, index: number) => ({
      rank: index + 1,
      user_id: entry.userId,
      username: entry.username,
      total_score: entry.totalScore,
    }));
  }

  private async getStreakLeaderboardFromDB(limit: number): Promise<StreakEntry[]> {
    const entries = await prisma.leaderboardStreak.findMany({
      orderBy: { maxStreak: 'desc' },
      take: limit,
    });

    return entries.map((entry: any, index: number) => ({
      rank: index + 1,
      user_id: entry.userId,
      username: entry.username,
      max_streak: entry.maxStreak,
    }));
  }
}

export const leaderboardService = new LeaderboardService();
