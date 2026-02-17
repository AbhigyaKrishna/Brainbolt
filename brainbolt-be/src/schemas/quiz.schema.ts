import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

// Question response schema
export const QuestionResponseSchema = z
  .object({
    question_id: z.string().openapi({ example: 'clw1x2y3z4a5b6c7d8e9f0g1' }),
    prompt: z.string().openapi({ example: 'What is the capital of France?' }),
    choices: z.array(z.string()).openapi({ example: ['London', 'Berlin', 'Paris', 'Madrid'] }),
    difficulty: z.number().int().min(1).max(10).openapi({ example: 5 }),
    state_version: z.number().int().openapi({ example: 42 }),
  })
  .openapi('QuestionResponse');

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;

// Submit answer request schema
export const SubmitAnswerRequestSchema = z.object({
  body: z.object({
    choice_index: z
      .number()
      .int()
      .min(0)
      .max(3)
      .openapi({ example: 2, description: 'Zero-based index of chosen answer' }),
    state_version: z
      .number()
      .int()
      .openapi({ example: 42, description: 'Version from last question fetch (optimistic lock)' }),
  }),
  headers: z.object({
    'idempotency-key': z.string().uuid().optional(),
  }),
});

export type SubmitAnswerRequest = z.infer<typeof SubmitAnswerRequestSchema>['body'];

// Answer result response schema
export const AnswerResultResponseSchema = z
  .object({
    correct: z.boolean().openapi({ example: true }),
    correct_index: z.number().int().min(0).max(3).openapi({ example: 2 }),
    explanation: z.string().nullable().openapi({ example: 'Paris is the capital of France.' }),
    score_delta: z.number().int().openapi({ example: 50 }),
    new_total_score: z.number().int().openapi({ example: 1250 }),
    new_streak: z.number().int().openapi({ example: 5 }),
    new_difficulty: z.number().openapi({ example: 5.5 }),
  })
  .openapi('AnswerResultResponse');

export type AnswerResultResponse = z.infer<typeof AnswerResultResponseSchema>;

// User stats response schema
export const UserStatsResponseSchema = z
  .object({
    total_score: z.number().int().openapi({ example: 1250 }),
    current_streak: z.number().int().openapi({ example: 5 }),
    max_streak: z.number().int().openapi({ example: 12 }),
    current_difficulty: z.number().openapi({ example: 5.5 }),
    total_questions_answered: z.number().int().openapi({ example: 87 }),
    correct_answers: z.number().int().openapi({ example: 65 }),
    accuracy: z.number().openapi({ example: 74.7 }),
  })
  .openapi('UserStatsResponse');

export type UserStatsResponse = z.infer<typeof UserStatsResponseSchema>;
