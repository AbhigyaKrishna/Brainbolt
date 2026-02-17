import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';

export function idempotency(req: Request, res: Response, next: NextFunction) {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return next();
  }

  // Check if we've seen this key before
  cacheService.checkIdempotency(idempotencyKey).then((cached) => {
    if (cached) {
      // Return cached response
      return res.status(200).json(cached);
    }
    next();
  }).catch((error) => {
    console.error('Idempotency check error:', error);
    next();
  });
}
