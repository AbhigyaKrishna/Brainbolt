# BrainBolt - Adaptive Infinite Quiz Platform

An intelligent, real-time adaptive quiz platform that dynamically adjusts question difficulty based on user performance. Built with Next.js, TypeScript, Express, PostgreSQL, and Redis.

## Features

- Adaptive Difficulty: Questions adjust in real-time based on user accuracy and streak
- Live Leaderboards: Real-time leaderboards for total score and current streak
- Streak System: Multiplier bonuses that reward consecutive correct answers
- Real-Time Updates: Instant feedback on scoring, difficulty, and rankings
- Idempotent Submissions: Duplicate answer handling ensures data integrity
- Rate Limiting & Security: Built-in protection against abuse
- Responsive Design: Works seamlessly on desktop and mobile devices
- Dark Mode Support: Light and dark theme options

## Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma
- **Authentication**: JWT-based

### Frontend Stack
- **Framework**: Next.js 14+ with React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Custom HTTP client with type safety

## Quick Start with Docker Compose

### Prerequisites
- Docker and Docker Compose installed
- Unix-like environment (Linux, macOS, or WSL on Windows)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brainbolt
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker compose up --build
   ```

   This command will:
   - Build the frontend and backend Docker images
   - Start PostgreSQL database
   - Start Redis cache
   - Start the backend API server
   - Start the frontend Next.js application

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/api/docs

### Stopping the Application

```bash
docker compose down
```

To also remove the database volume:
```bash
docker compose down -v
```

## Environment Configuration

The docker-compose setup includes default environment variables. To override them, create a `.env` file in the project root:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://postgres:postgres@db:5432/postgres?sslmode=disable
REDIS_URL=redis://redis:6379
API_URL=http://backend:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Environment Variables Explained

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | JWT signing key | `supersecretkey0987654321@!masterchief` |
| `DATABASE_URL` | PostgreSQL connection string | Internal Docker network |
| `REDIS_URL` | Redis connection URL | Internal Docker network |
| `API_URL` | Backend API URL (internal) | `http://backend:8000` |
| `NEXT_PUBLIC_API_URL` | Frontend API URL (public) | `http://localhost:8000` |

## Project Structure

```
brainbolt/
├── brainbolt-be/              # Backend API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── schemas/           # Request validation
│   │   └── lib/              # Utilities (JWT, Prisma, Redis)
│   ├── prisma/               # Database schema & migrations
│   └── Dockerfile
├── brainbolt-fe/              # Frontend Application
│   ├── app/                   # Next.js app router
│   ├── components/            # React components
│   ├── lib/                  # Frontend utilities
│   ├── store/                # Zustand stores
│   ├── types/                # TypeScript types
│   └── Dockerfile
├── docker-compose.yml         # Multi-container setup
└── Readme.md
```

## API Endpoints

### Quiz Endpoints
- `GET /v1/quiz/next` - Get the next question
- `POST /v1/quiz/answer` - Submit an answer
- `GET /v1/quiz/metrics` - Get user metrics

### Leaderboard Endpoints
- `GET /v1/leaderboard/score` - Get top users by total score
- `GET /v1/leaderboard/streak` - Get top users by streak

### Authentication Endpoints
- `POST /v1/auth/register` - Register a new user
- `POST /v1/auth/login` - Login user
- `POST /v1/auth/logout` - Logout user

## Authentication

The application uses JWT-based authentication. After registering or logging in, a token is provided that must be included in subsequent requests as a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Database

The application uses PostgreSQL with Prisma ORM. The database is automatically initialized when using Docker Compose. Schema migrations are located in `brainbolt-be/prisma/migrations/`.

## Caching Strategy

Redis is used for:
- Caching user state (difficulty, streak, score)
- Caching question pools by difficulty
- Real-time leaderboard updates
- Session management

## Development

For local development without Docker, refer to:
- [Backend Quick Start](./brainbolt-be/docs/QUICKSTART.md)
- [Frontend Quick Start](./brainbolt-fe/docs/QUICK_START.md)

## Real-Time Features

The application ensures real-time updates for:
- User score updates
- Current streak and max streak
- Adaptive difficulty adjustment
- Leaderboard ranking changes

All updates are reflected immediately in the next question response.

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Protects against brute force attacks
- **Idempotent Submissions**: Prevents duplicate answer processing
- **Input Validation**: Schema-based request validation
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## Troubleshooting

### Port Already in Use
If ports 3000 or 8000 are already in use, you can modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Map to different port
```

### Database Connection Issues
Ensure all services are running:
```bash
docker compose ps
```

### Building Image Issues
Clear Docker cache and rebuild:
```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```

## License

This project is part of an educational assignment.

## Contributing

For detailed implementation information, see:
- [Backend Implementation Guide](./brainbolt-be/docs/IMPLEMENTATION.md)
- [Frontend Implementation Guide](./brainbolt-fe/docs/IMPLEMENTATION_SUMMARY.md)

## Support

For issues or questions, refer to the documentation in the respective service directories or check the API documentation at http://localhost:8000/api/docs when the application is running.
