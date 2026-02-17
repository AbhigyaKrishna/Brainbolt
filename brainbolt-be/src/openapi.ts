import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';
import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  AuthResponseSchema,
  UserResponseSchema,
} from './schemas/auth.schema';
import {
  QuestionResponseSchema,
  SubmitAnswerRequestSchema,
  AnswerResultResponseSchema,
  UserStatsResponseSchema,
} from './schemas/quiz.schema';
import {
  LeaderboardQuerySchema,
  ScoreLeaderboardResponseSchema,
  StreakLeaderboardResponseSchema,
} from './schemas/leaderboard.schema';

const registry = new OpenAPIRegistry();

// Auth endpoints
registry.registerPath({
  method: 'post',
  path: '/v1/auth/register',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: RegisterRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User registered successfully',
      content: {
        'application/json': {
          schema: AuthResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error or user already exists',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/auth/login',
  tags: ['Authentication'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoginRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: {
        'application/json': {
          schema: AuthResponseSchema,
        },
      },
    },
    401: {
      description: 'Invalid credentials',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/auth/me',
  tags: ['Authentication'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Current user',
      content: {
        'application/json': {
          schema: UserResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
    },
  },
});

// Quiz endpoints
registry.registerPath({
  method: 'get',
  path: '/v1/quiz/questions/next',
  tags: ['Quiz'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'Next question',
      content: {
        'application/json': {
          schema: QuestionResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
    },
    404: {
      description: 'No questions available',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/v1/quiz/answers',
  tags: ['Quiz'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: SubmitAnswerRequestSchema.shape.body,
        },
      },
    },
    headers: SubmitAnswerRequestSchema.shape.headers,
  },
  responses: {
    200: {
      description: 'Answer submitted',
      content: {
        'application/json': {
          schema: AnswerResultResponseSchema,
        },
      },
    },
    400: {
      description: 'Invalid request',
    },
    401: {
      description: 'Unauthorized',
    },
    409: {
      description: 'State version mismatch',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/quiz/stats',
  tags: ['Quiz'],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: 'User statistics',
      content: {
        'application/json': {
          schema: UserStatsResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized',
    },
  },
});

// Leaderboard endpoints
registry.registerPath({
  method: 'get',
  path: '/v1/leaderboard/score',
  tags: ['Leaderboard'],
  request: {
    query: LeaderboardQuerySchema.shape.query,
  },
  responses: {
    200: {
      description: 'Score leaderboard',
      content: {
        'application/json': {
          schema: ScoreLeaderboardResponseSchema,
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/v1/leaderboard/streak',
  tags: ['Leaderboard'],
  request: {
    query: LeaderboardQuerySchema.shape.query,
  },
  responses: {
    200: {
      description: 'Streak leaderboard',
      content: {
        'application/json': {
          schema: StreakLeaderboardResponseSchema,
        },
      },
    },
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

export const openApiDocument = generator.generateDocument({
  openapi: '3.1.0',
  info: {
    title: 'BrainBolt API',
    version: '1.0.0',
    description: 'Quiz API with adaptive difficulty and leaderboards',
  },
  servers: [
    {
      url: 'http://localhost:8000',
      description: 'Development server',
    },
  ],
});

export function setupOpenAPI(app: Application): void {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
  app.get('/openapi.json', (_req: any, res: any) => {
    res.json(openApiDocument);
  });
  console.log('OpenAPI documentation available at /docs');
}
