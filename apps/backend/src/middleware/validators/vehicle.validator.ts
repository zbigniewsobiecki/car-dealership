import { body } from 'express-validator';
import { VehicleStatus } from '@car-dealership/shared-types';

const currentYear = new Date().getFullYear();

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
    .isInt({ min: 1900, max: currentYear + 1 })
    .withMessage(`Year must be between 1900 and ${currentYear + 1}`),

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
];