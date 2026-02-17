/**
 * Score Calculation Service
 * Score delta = floor(difficulty) * 10 * min(1 + streak * 0.1, 3.0)
 */

const BASE_POINTS_PER_DIFFICULTY = 10;
const STREAK_MULTIPLIER = 0.1;
const MAX_COMBO_MULTIPLIER = 3.0;

export class ScoreService {
  /**
   * Calculate score delta for a correct answer
   */
  calculateScoreDelta(difficulty: number, streak: number): number {
    const baseDifficulty = Math.floor(difficulty);
    const comboMultiplier = Math.min(1 + streak * STREAK_MULTIPLIER, MAX_COMBO_MULTIPLIER);
    return baseDifficulty * BASE_POINTS_PER_DIFFICULTY * comboMultiplier;
  }

  /**
   * Score delta is always 0 for wrong answers
   */
  calculateScoreDeltaWrong(): number {
    return 0;
  }
}

export const scoreService = new ScoreService();
