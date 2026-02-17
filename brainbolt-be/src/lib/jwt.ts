import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  sub: string; // user ID
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId } as JwtPayload, config.SECRET_KEY, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.SECRET_KEY) as JwtPayload;
}
