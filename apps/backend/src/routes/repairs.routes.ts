import { Router } from 'express';
import { repairsController } from '../controllers/repairs.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = Router();

// All repair routes require authentication
router.use(authenticateToken);

router.get('/', repairsController.getAll);
router.get('/stats', repairsController.getStats);
router.get('/active', repairsController.getActive);
router.get('/vehicle/:vehicleId', repairsController.getByVehicleId);
router.get('/customer/:customerId', repairsController.getByCustomerId);
router.get('/:id', repairsController.getById);
router.post('/', repairsController.create);
router.put('/:id', repairsController.update);
router.delete('/:id', repairsController.delete);

export default router;
