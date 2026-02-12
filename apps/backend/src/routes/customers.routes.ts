import { Router } from 'express';
import { customersController } from '../controllers/customers.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = Router();

// All customer routes require authentication
router.use(authenticateToken);

router.get('/', customersController.getAll);
router.get('/:id', customersController.getById);
router.get('/:id/sales', customersController.getSales);
router.post('/', customersController.create);
router.put('/:id', customersController.update);
router.delete('/:id', customersController.delete);

export default router;
