import { config } from './config';
import { createApp } from './app';
import { setupOpenAPI } from './openapi';
import authRoutes from './routes/auth.routes';
import quizRoutes from './routes/quiz.routes';
import leaderboardRoutes from './routes/leaderboard.routes';
import { leaderboardService } from './services/leaderboard.service';
import { errorHandler } from './middleware/error-handler';

async function start() {
  try {
    const app = createApp();

    app.use('/v1/auth', authRoutes);
    app.use('/v1/quiz', quizRoutes);
    app.use('/v1/leaderboard', leaderboardRoutes);

    setupOpenAPI(app);

    // Error handler must be registered AFTER routes
    app.use(errorHandler);

    console.log('Rebuilding Redis leaderboards...');
    await leaderboardService.rebuildRedisLeaderboards();

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
      console.log(`API docs available at http://localhost:${config.PORT}/docs`);
      console.log(`OpenAPI spec at http://localhost:${config.PORT}/openapi.json`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
