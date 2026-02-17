"use client";

import { create } from "zustand";
import type { Question, AnswerResult } from "@/types";
import { quizApi } from "@/lib/api-client";

interface QuizState {
  currentQuestion: Question | null;
  sessionId: string | null;
  stateVersion: number;
  selectedAnswer: number | null;
  answerResult: AnswerResult | null;
  score: number;
  streak: number;
  difficulty: number;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  idempotencyKey: string | null;
  leaderboardRankScore: number | null;
  leaderboardRankStreak: number | null;

  setSelectedAnswer: (index: number) => void;
  fetchNextQuestion: (token: string) => Promise<void>;
  submitAnswer: (token: string) => Promise<void>;
  resetQuiz: () => void;
  clearError: () => void;
}

function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuestion: null,
  sessionId: null,
  stateVersion: 0,
  selectedAnswer: null,
  answerResult: null,
  score: 0,
  streak: 0,
  difficulty: 1,
  isSubmitting: false,
  isLoading: false,
  error: null,
  idempotencyKey: null,
  leaderboardRankScore: null,
  leaderboardRankStreak: null,

  setSelectedAnswer: (index) => {
    const { answerResult } = get();
    // Don't allow selection changes after answer submission
    if (answerResult) return;
    set({ selectedAnswer: index });
  },

  fetchNextQuestion: async (token) => {
    set({ isLoading: true, error: null, answerResult: null, selectedAnswer: null });
    try {
      const { sessionId } = get();
      const question = await quizApi.getNextQuestion(token, sessionId || undefined);
      
      set({
        currentQuestion: question,
        sessionId: question.session_id,
        stateVersion: question.state_version,
        difficulty: question.difficulty,
        isLoading: false,
        idempotencyKey: generateIdempotencyKey(),
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch question",
        isLoading: false,
      });
    }
  },

  submitAnswer: async (token) => {
    const {
      selectedAnswer,
      sessionId,
      stateVersion,
      idempotencyKey,
      answerResult,
      isSubmitting,
    } = get();

    // Prevent double submission
    if (answerResult || isSubmitting || selectedAnswer === null || !sessionId || !idempotencyKey) {
      return;
    }

    set({ isSubmitting: true, error: null });
    try {
      const result = await quizApi.submitAnswer(token, {
        session_id: sessionId,
        state_version: stateVersion,
        choice_index: selectedAnswer,
        idempotency_key: idempotencyKey,
      });

      set({
        answerResult: result,
        score: result.new_total_score,
        streak: result.new_streak,
        difficulty: result.new_difficulty,
        isSubmitting: false,
        leaderboardRankScore: result.leaderboard_rank_score ?? null,
        leaderboardRankStreak: result.leaderboard_rank_streak ?? null,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to submit answer",
        isSubmitting: false,
      });
    }
  },

  resetQuiz: () => {
    set({
      currentQuestion: null,
      sessionId: null,
      stateVersion: 0,
      selectedAnswer: null,
      answerResult: null,
      score: 0,
      streak: 0,
      difficulty: 1,
      isSubmitting: false,
      isLoading: false,
      error: null,
      idempotencyKey: null,
      leaderboardRankScore: null,
      leaderboardRankStreak: null,
    });
  },

  clearError: () => set({ error: null }),
}));
