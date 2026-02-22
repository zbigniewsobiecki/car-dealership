import { Router } from 'express';
import type { IRouter } from 'express';
import { reportsController } from '../controllers/reports.controller.js';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import { UserRole } from '@car-dealership/shared-types';

const router: IRouter = Router();

// All report routes require authentication and admin roles
router.use(authenticateToken);
router.use(requireRole(UserRole.ADMIN));

router.get('/revenue', reportsController.getRevenue);
router.get('/monthly-sales', reportsController.getMonthlySales);

export default router;