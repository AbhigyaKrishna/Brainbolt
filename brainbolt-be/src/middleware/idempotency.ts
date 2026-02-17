import { Request, Response, NextFunction } from 'express';
import { cacheService } from '../services/cache.service';

export function idempotency(req: Request, res: Response, next: NextFunction) {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    return next();
  }

  cacheService.checkIdempotency(idempotencyKey).then((cached) => {
    if (cached) {
      res.status(200).json(cached);
      return;
    }
    next();
  }).catch((error) => {
    console.error('Idempotency check error:', error);
    next();
  });
}
