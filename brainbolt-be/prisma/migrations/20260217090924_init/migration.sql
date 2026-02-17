-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" TEXT[],
    "correct_index" INTEGER NOT NULL,
    "explanation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_states" (
    "user_id" TEXT NOT NULL,
    "current_difficulty" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "max_streak" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "momentum" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "state_version" INTEGER NOT NULL DEFAULT 0,
    "last_answered_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_states_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "quiz_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_question_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quiz_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_logs" (
    "id" TEXT NOT NULL,
    "idempotency_key" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "choice_index" INTEGER NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "score_delta" INTEGER NOT NULL,
    "streak_at_answer" INTEGER NOT NULL,
    "answered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "answer_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_scores" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "total_score" INTEGER NOT NULL,

    CONSTRAINT "leaderboard_scores_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "leaderboard_streaks" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "max_streak" INTEGER NOT NULL,

    CONSTRAINT "leaderboard_streaks_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");

-- CreateIndex
CREATE INDEX "quiz_sessions_user_id_idx" ON "quiz_sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "answer_logs_idempotency_key_key" ON "answer_logs"("idempotency_key");

-- CreateIndex
CREATE INDEX "answer_logs_user_id_answered_at_idx" ON "answer_logs"("user_id", "answered_at");

-- CreateIndex
CREATE INDEX "answer_logs_session_id_idx" ON "answer_logs"("session_id");

-- CreateIndex
CREATE INDEX "leaderboard_scores_total_score_idx" ON "leaderboard_scores"("total_score" DESC);

-- CreateIndex
CREATE INDEX "leaderboard_streaks_max_streak_idx" ON "leaderboard_streaks"("max_streak" DESC);

-- AddForeignKey
ALTER TABLE "user_states" ADD CONSTRAINT "user_states_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_sessions" ADD CONSTRAINT "quiz_sessions_current_question_id_fkey" FOREIGN KEY ("current_question_id") REFERENCES "questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_logs" ADD CONSTRAINT "answer_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_logs" ADD CONSTRAINT "answer_logs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "quiz_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_logs" ADD CONSTRAINT "answer_logs_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_scores" ADD CONSTRAINT "leaderboard_scores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leaderboard_streaks" ADD CONSTRAINT "leaderboard_streaks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
