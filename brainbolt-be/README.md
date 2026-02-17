# BrainBolt Backend API

Express + TypeScript backend API for BrainBolt quiz application with adaptive difficulty, Redis caching, and PostgreSQL database.

## Features

- 🔐 JWT-based authentication
- 🎯 Adaptive difficulty with momentum-based algorithm
- 📊 Real-time leaderboards (score & streak)
- 💾 Redis caching for performance
- 🔄 Optimistic locking for concurrency
- 🎲 Idempotency support
- 🚦 Rate limiting
- 📚 OpenAPI 3.1 documentation
- 🐳 Docker support

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 16
- **Cache**: Redis 7
- **ORM**: Prisma
- **Validation**: Zod
- **Documentation**: OpenAPI 3.1 (Swagger UI)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Seed the database:
```bash
npm run prisma:seed
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- OpenAPI spec: `http://localhost:8000/openapi.json`

### Docker

```bash
# From the root directory
docker-compose up --build
```

## API Endpoints

### Authentication
- `POST /v1/auth/register` - Register new user
- `POST /v1/auth/login` - Login user
- `GET /v1/auth/me` - Get current user (requires auth)

### Quiz
- `GET /v1/quiz/questions/next` - Get next question (requires auth)
- `POST /v1/quiz/answers` - Submit answer (requires auth)
- `GET /v1/quiz/stats` - Get user statistics (requires auth)

### Leaderboard
- `GET /v1/leaderboard/score` - Get score leaderboard (public)
- `GET /v1/leaderboard/streak` - Get streak leaderboard (public)

## Database Schema

- **User** - User accounts
- **UserState** - User quiz state (difficulty, streak, score, momentum)
- **Question** - Quiz questions (200+ seeded across 10 difficulty levels)
- **QuizSession** - Active quiz sessions
- **AnswerLog** - Answer history with idempotency
- **LeaderboardScore** - Persistent score leaderboard
- **LeaderboardStreak** - Persistent streak leaderboard

## Adaptive Difficulty Algorithm

The backend uses a momentum-based adaptive difficulty system:

- **Momentum** (0 → 1.5): Increases by 0.15 on correct, halves on wrong
- **Hysteresis threshold**: Difficulty only increases when momentum ≥ 0.3
- **On correct**: If momentum sufficient → difficulty increases, else holds
- **On wrong**: Difficulty decreases by 0.8, momentum halves
- **Clamp**: Difficulty always between 1-10
- **Ping-pong prevention**: Alternating correct/wrong answers won't cause difficulty oscillation

## Score Calculation

```
scoreDelta = floor(difficulty) * 10 * min(1 + streak * 0.1, 3.0)
```

- Higher difficulty = more points
- Longer streaks = combo multiplier (up to 3x)
- Wrong answers = 0 points, streak resets

## Caching Strategy

- User state: 10 min TTL, write-through
- Question pools: 60 min TTL
- Leaderboards: Redis ZSET, no TTL, write-through
- Idempotency: 5 min TTL

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with questions
- `npm run prisma:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `REDIS_URL` | Redis connection string | Required |
| `SECRET_KEY` | JWT signing key (min 32 chars) | Required |
| `PORT` | Server port | 8000 |
| `NODE_ENV` | Environment | development |

## License

MIT
