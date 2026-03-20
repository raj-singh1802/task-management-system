import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected route — test middleware
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'You are authenticated',
    data: { user: req.user },
  });
});

export default router;