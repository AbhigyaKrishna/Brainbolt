import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const RegisterRequestSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .openapi({ example: 'johndoe' }),
    email: z.string().email('Invalid email address').openapi({ example: 'john@example.com' }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .openapi({ example: 'password123' }),
  }),
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>['body'];

export const LoginRequestSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').openapi({ example: 'john@example.com' }),
    password: z.string().min(1, 'Password is required').openapi({ example: 'password123' }),
  }),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>['body'];

export const UserResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clw1x2y3z4a5b6c7d8e9f0g1' }),
    username: z.string().openapi({ example: 'johndoe' }),
    email: z.string().email().openapi({ example: 'john@example.com' }),
    created_at: z.string().datetime().openapi({ example: '2024-01-01T00:00:00.000Z' }),
  })
  .openapi('UserResponse');

export type UserResponse = z.infer<typeof UserResponseSchema>;

export const AuthResponseSchema = z
  .object({
    access_token: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }),
    token_type: z.string().default('bearer').openapi({ example: 'bearer' }),
    user: UserResponseSchema,
  })
  .openapi('AuthResponse');

export type AuthResponse = z.infer<typeof AuthResponseSchema>;
