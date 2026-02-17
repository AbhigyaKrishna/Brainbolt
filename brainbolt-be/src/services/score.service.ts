const BASE_POINTS_PER_DIFFICULTY = 10;
const STREAK_MULTIPLIER = 0.1;
const MAX_COMBO_MULTIPLIER = 3.0;

export class ScoreService {
  calculateScoreDelta(difficulty: number, streak: number): number {
    const baseDifficulty = Math.floor(difficulty);
    const comboMultiplier = Math.min(1 + streak * STREAK_MULTIPLIER, MAX_COMBO_MULTIPLIER);
    return baseDifficulty * BASE_POINTS_PER_DIFFICULTY * comboMultiplier;
  }

  calculateScoreDeltaWrong(): number {
    return 0;
  }
}

export const scoreService = new ScoreService();
