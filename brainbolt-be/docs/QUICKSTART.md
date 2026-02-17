# BrainBolt Backend - Quick Start

Get the backend running in 5 minutes!

## Option 1: Docker (Recommended)

```bash
# From project root
docker-compose up --build
```

**That's it!** Backend will be running at http://localhost:8000

- API docs: http://localhost:8000/docs
- OpenAPI spec: http://localhost:8000/openapi.json

## Option 2: Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+

### Steps

```bash
# 1. Navigate to backend
cd brainbolt-be

# 2. Install dependencies
npm install

# 3. Set up environment
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/brainbolt
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-super-secret-key-min-32-characters-long
PORT=8000
NODE_ENV=development
EOF

# 4. Create database
createdb brainbolt

# 5. Run migrations
npx prisma migrate dev --name init

# 6. Seed questions (200+)
npm run prisma:seed

# 7. Start server
npm run dev
```

**Done!** Backend running at http://localhost:8000

## Quick Test

```bash
# Register a user
curl -X POST http://localhost:8000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# You should get back:
# {
#   "access_token": "eyJhbGciOi...",
#   "token_type": "bearer",
#   "user": { ... }
# }
```

## Troubleshooting

### "Cannot find module 'zod'"
```bash
npm install
```

### "Connection refused" (database)
```bash
# macOS with Homebrew
brew services start postgresql@16

# Linux
sudo systemctl start postgresql
```

### "Connection refused" (redis)
```bash
# macOS with Homebrew
brew services start redis

# Linux
sudo systemctl start redis
```

### "SECRET_KEY must be at least 32 characters"
```bash
# Generate a secure key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Next Steps

1. Open http://localhost:8000/docs to explore the API
2. Try the frontend: `cd brainbolt-fe && npm run dev`
3. Read [IMPLEMENTATION.md](./IMPLEMENTATION.md) for architecture details

## Common Commands

```bash
# Development
npm run dev              # Start with hot reload
npm run build            # Build for production
npm start                # Start production server

# Database
npx prisma studio        # Visual database editor
npx prisma migrate dev   # Create migration
npm run prisma:seed      # Seed questions

# Code Quality
npm run lint             # Check for errors
npm run format           # Format with Prettier
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `REDIS_URL` | Yes | - | Redis connection string |
| `SECRET_KEY` | Yes | - | JWT signing key (min 32 chars) |
| `PORT` | No | 8000 | Server port |
| `NODE_ENV` | No | development | Environment |

## Support

- Check [README.md](./README.md) for full documentation
- Check [IMPLEMENTATION.md](./IMPLEMENTATION.md) for architecture
- Issues? Check the error logs in the console
