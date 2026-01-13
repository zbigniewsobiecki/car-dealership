import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { UserRole } from '@car-dealership/shared-types';

const router = Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

// Protected routes (admin only for registration)
router.post('/register', authenticateToken, requireRole(UserRole.ADMIN), authController.register);

// Protected routes
router.get('/me', authenticateToken, authController.getMe);

export default router;
