import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../../middlewares/validate-request';
import { registerSchema, loginSchema } from './auth.schema';

const router = Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

router.post('/login', validateRequest(loginSchema), authController.login);

export default router;
