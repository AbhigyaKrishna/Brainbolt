import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getDifficultyColor(difficulty: number): string {
  const clampedDiff = Math.max(1, Math.min(10, Math.round(difficulty)));
  return `hsl(var(--difficulty-${clampedDiff}))`;
}

export function getDifficultyLabel(difficulty: number): string {
  const clampedDiff = Math.round(difficulty);
  if (clampedDiff <= 3) return "Easy";
  if (clampedDiff <= 5) return "Medium";
  if (clampedDiff <= 7) return "Hard";
  return "Expert";
}
