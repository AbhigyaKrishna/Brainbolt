const MOMENTUM_INCREASE = 0.15;
const MOMENTUM_DECREASE_FACTOR = 0.5;
const HYSTERESIS_THRESHOLD = 0.3;
const DIFFICULTY_INCREASE_BASE = 0.5;
const DIFFICULTY_DECREASE = 0.8;
const MOMENTUM_MULTIPLIER = 0.3;
const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 10;
const MAX_MOMENTUM = 1.5;

export interface AdaptiveState {
  currentDifficulty: number;
  momentum: number;
}

export class AdaptiveService {
  adjustOnCorrect(state: AdaptiveState): AdaptiveState {
    let newMomentum = Math.min(state.momentum + MOMENTUM_INCREASE, MAX_MOMENTUM);

    let newDifficulty = state.currentDifficulty;

    if (newMomentum >= HYSTERESIS_THRESHOLD) {
      const increase = DIFFICULTY_INCREASE_BASE * (1 + newMomentum * MOMENTUM_MULTIPLIER);
      newDifficulty = Math.min(state.currentDifficulty + increase, MAX_DIFFICULTY);
    }

    return {
      currentDifficulty: newDifficulty,
      momentum: newMomentum,
    };
  }

  adjustOnWrong(state: AdaptiveState): AdaptiveState {
    const newMomentum = state.momentum * MOMENTUM_DECREASE_FACTOR;

    const newDifficulty = Math.max(state.currentDifficulty - DIFFICULTY_DECREASE, MIN_DIFFICULTY);

    return {
      currentDifficulty: newDifficulty,
      momentum: newMomentum,
    };
  }

  getDifficultyRange(currentDifficulty: number): number[] {
    const rounded = Math.round(currentDifficulty);
    return [Math.max(rounded - 1, MIN_DIFFICULTY), Math.min(rounded + 1, MAX_DIFFICULTY)];
  }

  selectBestDifficulty(currentDifficulty: number, availableDifficulties: number[]): number {
    if (availableDifficulties.length === 0) {
      return Math.round(currentDifficulty);
    }

    const rounded = Math.round(currentDifficulty);

    if (availableDifficulties.includes(rounded)) {
      return rounded;
    }

    return availableDifficulties.reduce((closest, difficulty) => {
      return Math.abs(difficulty - currentDifficulty) < Math.abs(closest - currentDifficulty)
        ? difficulty
        : closest;
    });
  }
}

export const adaptiveService = new AdaptiveService();
