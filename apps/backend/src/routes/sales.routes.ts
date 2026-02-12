import { Router } from 'express';
import { salesController } from '../controllers/sales.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = Router();

// All sales routes require authentication
router.use(authenticateToken);

router.get('/', salesController.getAll);
router.get('/stats', salesController.getStats);
router.get('/stats/monthly', salesController.getMonthlyStats);
router.get('/:id', salesController.getById);
router.post('/', salesController.create);
router.put('/:id', salesController.update);
router.delete('/:id', salesController.delete);

export default router;
