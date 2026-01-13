import { Router } from 'express';
import { vehiclesController } from '../controllers/vehicles.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

// All vehicle routes require authentication
router.use(authenticateToken);

router.get('/', vehiclesController.getAll);
router.get('/stats', vehiclesController.getStats);
router.get('/:id', vehiclesController.getById);
router.post('/', vehiclesController.create);
router.put('/:id', vehiclesController.update);
router.delete('/:id', vehiclesController.delete);

export default router;
