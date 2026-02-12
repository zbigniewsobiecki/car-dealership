import { body } from 'express-validator';
import { VehicleStatus, VehicleCondition } from '@car-dealership/shared-types';

export const createVehicleValidator = [
  body('vin')
    .trim()
    .notEmpty()
    .withMessage('VIN is required')
    .isLength({ min: 17, max: 17 })
    .withMessage('VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('VIN must be alphanumeric and cannot contain I, O, or Q'),

  body('make')
    .trim()
    .notEmpty()
    .withMessage('Make is required'),

  body('model')
    .trim()
    .notEmpty()
    .withMessage('Model is required'),

  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1900 })
    .withMessage('Year must be at least 1900')
    .custom((value: number) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear + 1) {
        throw new Error(`Year must not exceed ${currentYear + 1}`);
      }
      return true;
    }),

  body('color')
    .trim()
    .notEmpty()
    .withMessage('Color is required'),

  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(Object.values(VehicleStatus))
    .withMessage(`Status must be one of: ${Object.values(VehicleStatus).join(', ')}`),

  // Optional field validations
  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative integer'),

  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),

  body('condition')
    .optional()
    .isIn(Object.values(VehicleCondition))
    .withMessage(`Condition must be one of: ${Object.values(VehicleCondition).join(', ')}`),

  body('bodyType')
    .optional()
    .trim()
    .isString()
    .withMessage('Body type must be a string'),

  body('transmission')
    .optional()
    .trim()
    .isString()
    .withMessage('Transmission must be a string'),

  body('fuelType')
    .optional()
    .trim()
    .isString()
    .withMessage('Fuel type must be a string'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

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

export const updateVehicleValidator = [
  body('vin')
    .optional()
    .trim()
    .isLength({ min: 17, max: 17 })
    .withMessage('VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('VIN must be alphanumeric and cannot contain I, O, or Q'),

  body('make')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Make cannot be empty'),

  body('model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Model cannot be empty'),

  body('year')
    .optional()
    .isInt({ min: 1900 })
    .withMessage('Year must be at least 1900')
    .custom((value: number) => {
      const currentYear = new Date().getFullYear();
      if (value > currentYear + 1) {
        throw new Error(`Year must not exceed ${currentYear + 1}`);
      }
      return true;
    }),

  body('color')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Color cannot be empty'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('status')
    .optional()
    .isIn(Object.values(VehicleStatus))
    .withMessage(`Status must be one of: ${Object.values(VehicleStatus).join(', ')}`),

  body('mileage')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Mileage must be a non-negative integer'),

  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a non-negative number'),

  body('condition')
    .optional()
    .isIn(Object.values(VehicleCondition))
    .withMessage(`Condition must be one of: ${Object.values(VehicleCondition).join(', ')}`),

  body('bodyType')
    .optional()
    .trim()
    .isString()
    .withMessage('Body type must be a string'),

  body('transmission')
    .optional()
    .trim()
    .isString()
    .withMessage('Transmission must be a string'),

  body('fuelType')
    .optional()
    .trim()
    .isString()
    .withMessage('Fuel type must be a string'),

  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),

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