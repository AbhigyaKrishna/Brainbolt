import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ detail: err.message });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ detail: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ detail: 'Token expired' });
  }

  // Default error
  return res.status(500).json({ detail: 'Internal server error' });
}
