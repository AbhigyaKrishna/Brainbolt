const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  token?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { detail: response.statusText };
    }

    throw new ApiError(
      response.status,
      errorData?.detail || errorData?.message || "An error occurred",
      errorData
    );
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Auth API
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    fetchApi<{ access_token: string; token_type: string }>(
      "/v1/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),

  login: (data: { username: string; password: string }) =>
    fetchApi<{ access_token: string; token_type: string }>("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCurrentUser: (token: string) =>
    fetchApi<{
      id: string;
      username: string;
      email: string;
    }>("/v1/auth/me", { token }),
};

// Quiz API
export const quizApi = {
  getNextQuestion: (token: string) => {
    return fetchApi<{
      question_id: string;
      prompt: string;
      choices: string[];
      difficulty: number;
      state_version: number;
    }>("/v1/quiz/next", { token });
  },

  submitAnswer: (
    token: string,
    data: {
      state_version: number;
      choice_index: number;
      idempotency_key: string;
    }
  ) =>
    fetchApi<{
      correct: boolean;
      correct_index: number;
      score_delta: number;
      new_total_score: number;
      new_streak: number;
      new_difficulty: number;
      explanation: string | null;
    }>("/v1/quiz/answers", {
      method: "POST",
      token,
      headers: {
        "idempotency-key": data.idempotency_key,
      },
      body: JSON.stringify({
        choice_index: data.choice_index,
        state_version: data.state_version,
      }),
    }),

  getMetrics: (token: string) =>
    fetchApi<{
      total_score: number;
      current_streak: number;
      max_streak: number;
      total_questions_answered: number;
      correct_answers: number;
      current_difficulty: number;
      accuracy: number;
    }>("/v1/quiz/stats", { token }),
};

// Leaderboard API
export const leaderboardApi = {
  getScoreLeaderboard: (limit: number = 10) =>
    fetchApi<
      Array<{
        rank: number;
        user_id: string;
        username: string;
        total_score: number;
      }>
    >(`/v1/leaderboard/score?limit=${limit}`),

  getStreakLeaderboard: (limit: number = 10) =>
    fetchApi<
      Array<{
        rank: number;
        user_id: string;
        username: string;
        max_streak: number;
      }>
    >(`/v1/leaderboard/streak?limit=${limit}`),
};

export { API_BASE_URL };
