import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './middleware/error-handler';

export function createApp(): Application {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    })
  );

  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(errorHandler);

  return app;
}
