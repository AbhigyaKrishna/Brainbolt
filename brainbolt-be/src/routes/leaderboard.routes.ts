import { Router } from 'express';
import { leaderboardController } from '../controllers/leaderboard.controller';
import { rateLimit } from '../middleware/rate-limiter';
import { validate } from '../middleware/validate';
import { LeaderboardQuerySchema } from '../schemas/leaderboard.schema';

const router = Router();

const leaderboardRateLimit = rateLimit({ windowMs: 1000, maxRequests: 20 });

router.get('/score', leaderboardRateLimit, validate(LeaderboardQuerySchema), leaderboardController.getScoreLeaderboard);
router.get('/streak', leaderboardRateLimit, validate(LeaderboardQuerySchema), leaderboardController.getStreakLeaderboard);

export default router;
