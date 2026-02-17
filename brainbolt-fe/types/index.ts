export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Question {
  question_id: string;
  question_text: string;
  choices: string[];
  difficulty: number;
  state_version: number;
  session_id: string;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_choice_index: number;
  score_delta: number;
  new_streak: number;
  new_total_score: number;
  new_difficulty: number;
  explanation?: string;
  leaderboard_rank_score?: number;
  leaderboard_rank_streak?: number;
}

export interface QuizMetrics {
  total_score: number;
  current_streak: number;
  max_streak: number;
  total_questions_answered: number;
  correct_answers: number;
  current_difficulty: number;
  accuracy: number;
  difficulty_distribution: Record<number, number>;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  score?: number;
  streak?: number;
}

export type LeaderboardType = "score" | "streak";
