import { Request, Response, NextFunction } from 'express';
import { leaderboardService } from '../services/leaderboard.service';

export class LeaderboardController {
  async getScoreLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const leaderboard = await leaderboardService.getScoreLeaderboard(limit);
      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }

  async getStreakLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const leaderboard = await leaderboardService.getStreakLeaderboard(limit);
      res.status(200).json(leaderboard);
    } catch (error) {
      next(error);
    }
  }
}

export const leaderboardController = new LeaderboardController();
