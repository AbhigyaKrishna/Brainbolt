import { Request, Response, NextFunction } from 'express';
import { redis } from '../lib/redis';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export function rateLimit(config: RateLimitConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id || req.ip;
      const key = `ratelimit:${req.path}:${userId}`;
      const now = Date.now();
      const windowStart = now - config.windowMs;

      // Remove old entries and add current request
      await redis
        .multi()
        .zremrangebyscore(key, 0, windowStart)
        .zadd(key, now, `${now}`)
        .zcard(key)
        .expire(key, Math.ceil(config.windowMs / 1000))
        .exec();

      const count = await redis.zcard(key);

      if (count > config.maxRequests) {
        return res.status(429).json({
          detail: 'Too many requests, please try again later',
        });
      }

      next();
    } catch (error) {
      console.error('Rate limit error:', error);
      // On error, allow the request to proceed
      next();
    }
  };
}
