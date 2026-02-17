import { Router } from 'express';
import { quizController } from '../controllers/quiz.controller';
import { authenticate } from '../middleware/auth';
import { rateLimit } from '../middleware/rate-limiter';
import { validate } from '../middleware/validate';
import { SubmitAnswerRequestSchema } from '../schemas/quiz.schema';

const router = Router();

router.use(authenticate);

const quizRateLimit = rateLimit({ windowMs: 1000, maxRequests: 5 });

router.get('/questions/next', quizRateLimit, quizController.getNextQuestion);
router.post('/answers', quizRateLimit, validate(SubmitAnswerRequestSchema), quizController.submitAnswer);
router.get('/stats', authenticate, quizController.getUserStats);

export default router;
