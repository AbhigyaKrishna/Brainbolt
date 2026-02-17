import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { RegisterRequestSchema, LoginRequestSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(RegisterRequestSchema), authController.register);
router.post('/login', validate(LoginRequestSchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
