import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Leaderboard query schema
export const LeaderboardQuerySchema = z.object({
  query: z.object({
    limit: z
      .string()
      .optional()
      .transform((val: any) => (val ? parseInt(val, 10) : 100))
      .pipe(z.number().int().min(1).max(100))
      .openapi({ example: '50', description: 'Number of entries to return (1-100)' }),
  }),
});

export type LeaderboardQuery = z.infer<typeof LeaderboardQuerySchema>['query'];

// Score entry schema
export const ScoreEntrySchema = z
  .object({
    rank: z.number().int().openapi({ example: 1 }),
    user_id: z.string().openapi({ example: 'clw1x2y3z4a5b6c7d8e9f0g1' }),
    username: z.string().openapi({ example: 'johndoe' }),
    total_score: z.number().int().openapi({ example: 12450 }),
  })
  .openapi('ScoreEntry');

export type ScoreEntry = z.infer<typeof ScoreEntrySchema>;

// Streak entry schema
export const StreakEntrySchema = z
  .object({
    rank: z.number().int().openapi({ example: 1 }),
    user_id: z.string().openapi({ example: 'clw1x2y3z4a5b6c7d8e9f0g1' }),
    username: z.string().openapi({ example: 'johndoe' }),
    max_streak: z.number().int().openapi({ example: 42 }),
  })
  .openapi('StreakEntry');

export type StreakEntry = z.infer<typeof StreakEntrySchema>;

// Leaderboard response schemas
export const ScoreLeaderboardResponseSchema = z.array(ScoreEntrySchema).openapi('ScoreLeaderboard');

export type ScoreLeaderboardResponse = z.infer<typeof ScoreLeaderboardResponseSchema>;

export const StreakLeaderboardResponseSchema = z
  .array(StreakEntrySchema)
  .openapi('StreakLeaderboard');

export type StreakLeaderboardResponse = z.infer<typeof StreakLeaderboardResponseSchema>;
