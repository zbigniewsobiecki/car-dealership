import { body } from 'express-validator';
import { VehicleStatus, VehicleCondition } from '@car-dealership/shared-types';

const imageValidators = [
  body('images')
    .optional({ nullable: true })
    .isArray()
    .withMessage('Images must be an array'),

  body('images.*')
    .if(body('images').isArray())
    .isObject()
    .withMessage('Each image must be an object'),

  body('images.*.url')
    .if(body('images').isArray())
    .isURL()
    .withMessage('Each image must have a valid URL'),

  body('images.*.isPrimary')
    .if(body('images').isArray())
    .optional()
    .isBoolean()
    .withMessage('isPrimary must be a boolean'),

  body('images.*.order')
    .if(body('images').isArray())
    .optional()
    .isInt()
    .withMessage('Order must be an integer'),
];

const rules = {
  vin: () => body('vin')
    .trim()
    .isLength({ min: 17, max: 17 })
    .withMessage('VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('VIN must be alphanumeric and cannot contain I, O, or Q'),

  make: () => body('make')
    .trim(),

  model: () => body('model')
    .trim(),

  year: () => body('year')
    .isInt({ min: 1900 })
    .withMessage('Year must be at least 1900')
    .custom((value: number) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear + 1) {
        throw new Error(`Year must not exceed ${currentYear + 1}`);
      }
      return true;
    }),

  color: () => body('color')
    .trim(),

  price: () => body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  status: () => body('status')
    .isIn(Object.values(VehicleStatus))
    .withMessage(`Status must be one of: ${Object.values(VehicleStatus).join(', ')}`),

  mileage: () => body('mileage')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative integer'),

  cost: () => body('cost')
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),

  condition: () => body('condition')
    .isIn(Object.values(VehicleCondition))
    .withMessage(`Condition must be one of: ${Object.values(VehicleCondition).join(', ')}`),

  bodyType: () => body('bodyType')
    .trim()
    .isString()
    .withMessage('Body type must be a string'),

  transmission: () => body('transmission')
    .trim()
    .isString()
    .withMessage('Transmission must be a string'),

  fuelType: () => body('fuelType')
    .trim()
    .isString()
    .withMessage('Fuel type must be a string'),
};

export const createVehicleValidator = [
  rules.vin().notEmpty().withMessage('VIN is required'),
  rules.make().notEmpty().withMessage('Make is required'),
  rules.model().notEmpty().withMessage('Model is required'),
  rules.year().notEmpty().withMessage('Year is required'),
  rules.color().notEmpty().withMessage('Color is required'),
  rules.price().notEmpty().withMessage('Price is required'),
  rules.status().notEmpty().withMessage('Status is required'),

  // Optional fields
  rules.mileage().optional({ nullable: true }),
  rules.cost().optional({ nullable: true }),
  rules.condition().optional({ nullable: true }),
  rules.bodyType().optional({ nullable: true }),
  rules.transmission().optional({ nullable: true }),
  rules.fuelType().optional({ nullable: true }),

  ...imageValidators,
];

export const updateVehicleValidator = [
  rules.vin().optional(),
  rules.make().optional().notEmpty().withMessage('Make cannot be empty'),
  rules.model().optional().notEmpty().withMessage('Model cannot be empty'),
  rules.year().optional(),
  rules.color().optional().notEmpty().withMessage('Color cannot be empty'),
  rules.price().optional(),
  rules.status().optional(),

  // Nullable fields - allow null to clear the value
  rules.mileage().optional({ nullable: true }),
  rules.cost().optional({ nullable: true }),
  rules.condition().optional({ nullable: true }),
  rules.bodyType().optional({ nullable: true }),
  rules.transmission().optional({ nullable: true }),
  rules.fuelType().optional({ nullable: true }),

  ...imageValidators,
];