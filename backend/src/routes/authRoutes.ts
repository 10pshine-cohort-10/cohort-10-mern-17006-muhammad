import { Router } from 'express';
import * as controller from '../controllers/authController';
import auth from '../middleware/auth';
import validate from '../middleware/validate';
import { loginSchema, registerSchema } from '../validators/authValidators';

const router = Router();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.get('/me', auth, controller.me);

export default router;
