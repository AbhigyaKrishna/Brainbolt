import { redis } from '../lib/redis';

const USER_STATE_TTL = 600; // 10 minutes
const QUESTION_POOL_TTL = 3600; // 60 minutes
const IDEMPOTENCY_TTL = 300; // 5 minutes

export class CacheService {
  // User state caching
  async getUserState(userId: string): Promise<any | null> {
    try {
      const cached = await redis.get(`user:state:${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async setUserState(userId: string, state: any): Promise<void> {
    try {
      await redis.setex(`user:state:${userId}`, USER_STATE_TTL, JSON.stringify(state));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async invalidateUserState(userId: string): Promise<void> {
    try {
      await redis.del(`user:state:${userId}`);
    } catch (error) {
      console.error('Redis del error:', error);
    }
  }

  // Question pool caching
  async getQuestionPool(difficulty: number): Promise<string[] | null> {
    try {
      const cached = await redis.get(`questions:difficulty:${difficulty}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async setQuestionPool(difficulty: number, questionIds: string[]): Promise<void> {
    try {
      await redis.setex(
        `questions:difficulty:${difficulty}`,
        QUESTION_POOL_TTL,
        JSON.stringify(questionIds)
      );
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  // Idempotency
  async checkIdempotency(key: string): Promise<any | null> {
    try {
      const cached = await redis.get(`idempotency:${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async setIdempotency(key: string, result: any): Promise<boolean> {
    try {
      const success = await redis.set(`idempotency:${key}`, JSON.stringify(result), 'EX', IDEMPOTENCY_TTL, 'NX');
      return success === 'OK';
    } catch (error) {
      console.error('Redis set error:', error);
      return false;
    }
  }
}

export const cacheService = new CacheService();
