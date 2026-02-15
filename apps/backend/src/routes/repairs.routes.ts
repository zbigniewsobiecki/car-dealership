import { Router } from 'express';
import { repairsController } from '../controllers/repairs.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = Router();

// All repair routes require authentication
router.use(authenticateToken);

router.get('/', repairsController.getAll);
router.get('/:id', repairsController.getById);
router.post('/', repairsController.create);
router.patch('/:id', repairsController.update);
router.delete('/:id', repairsController.delete);

export default router;
