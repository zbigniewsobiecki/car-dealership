import { Router } from 'express';
import { vehiclesController } from '../controllers/vehicles.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createVehicleValidator } from '../middleware/validators/vehicle.validator.js';

const router: Router = Router();

// All vehicle routes require authentication
router.use(authenticateToken);

router.get('/', vehiclesController.getAll);
router.get('/stats', vehiclesController.getStats);
router.get('/:id', vehiclesController.getById);
router.post('/', createVehicleValidator, validate, vehiclesController.create);
router.put('/:id', vehiclesController.update);
router.delete('/:id', vehiclesController.delete);

export default router;
