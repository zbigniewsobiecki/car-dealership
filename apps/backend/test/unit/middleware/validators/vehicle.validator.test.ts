import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { VehicleStatus, VehicleCondition, VehicleType } from '@car-dealership/shared-types';
import { createVehicleValidator } from '../../../../src/middleware/validators/vehicle.validator.js';
import { validate } from '../../../../src/middleware/validation.middleware.js';
import { validationResult } from 'express-validator';

// Helper to run express-validator middleware
const runMiddleware = async (req: Request, res: Response, middlewares: ((req: Request, res: Response, next: NextFunction) => void)[]) => {
  for (const middleware of middlewares) {
    await new Promise<void>((resolve, reject) => {
      middleware(req, res, (err?: unknown) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
};

describe('Vehicle Validator', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {};
    mockNext = vi.fn();
  });

  const validVehicle = {
    vin: '1234567890ABCDEFG', // 17 chars, no I, O, Q
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    color: 'Blue',
    price: 25000,
    type: VehicleType.CAR,
    status: VehicleStatus.AVAILABLE,
  };

  it('should pass with a valid vehicle payload', async () => {
    mockReq.body = { ...validVehicle };
    
    await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
    const errors = validationResult(mockReq as Request);
    
    expect(errors.isEmpty()).toBe(true);
    
    // Test the validate middleware as well
    expect(() => validate(mockReq as Request, mockRes as Response, mockNext)).not.toThrow();
    expect(mockNext).toHaveBeenCalled();
  });

  describe('VIN validation', () => {
    it('should fail if VIN is missing', async () => {
      const { vin: _, ...rest } = validVehicle;
      mockReq.body = rest;
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg === 'VIN is required')).toBe(true);
    });

    it('should fail if VIN is not 17 characters', async () => {
      mockReq.body = { ...validVehicle, vin: '12345' };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg === 'VIN must be exactly 17 characters')).toBe(true);
    });

    it('should fail if VIN contains forbidden characters (I, O, Q)', async () => {
      mockReq.body = { ...validVehicle, vin: '1234567890ABCDEFI' };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      let errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg === 'VIN must be alphanumeric and cannot contain I, O, or Q')).toBe(true);

      mockReq.body.vin = '1234567890ABCDEFO';
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg === 'VIN must be alphanumeric and cannot contain I, O, or Q')).toBe(true);

      mockReq.body.vin = '1234567890ABCDEFQ';
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg === 'VIN must be alphanumeric and cannot contain I, O, or Q')).toBe(true);
    });
  });

  describe('Year validation', () => {
    it('should fail if year is too old', async () => {
      mockReq.body = { ...validVehicle, year: 1899 };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg.includes('Year must be at least 1900'))).toBe(true);
    });

    it('should fail if year is too far in the future', async () => {
      const futureYear = new Date().getFullYear() + 2;
      mockReq.body = { ...validVehicle, year: futureYear };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg.includes('Year must not exceed'))).toBe(true);
    });

    it('should accept next year (for future model years)', async () => {
      const nextYear = new Date().getFullYear() + 1;
      mockReq.body = { ...validVehicle, year: nextYear };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe('Price validation', () => {
    it('should fail if price is negative', async () => {
      mockReq.body = { ...validVehicle, price: -100 };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg === 'Price must be a positive number')).toBe(true);
    });
  });

  describe('Status validation', () => {
    it('should fail if status is invalid', async () => {
      mockReq.body = { ...validVehicle, status: 'invalid-status' };
      await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
      const errors = validationResult(mockReq as Request);
      expect(errors.array().some(e => e.msg.includes('Status must be one of'))).toBe(true);
    });
  });

  describe('Required fields', () => {
    const requiredFields = ['make', 'model', 'color', 'type'];

    requiredFields.forEach(field => {
      it(`should fail if ${field} is missing`, async () => {
        const payload = { ...validVehicle } as Record<string, unknown>;
        delete payload[field];
        mockReq.body = payload;
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.array().some(e => e.msg.includes('is required'))).toBe(true);
      });
    });
  });

  describe('Optional field validation', () => {
    describe('mileage', () => {
      it('should pass when mileage is not provided', async () => {
        mockReq.body = { ...validVehicle };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });

      it('should pass when mileage is a valid non-negative integer', async () => {
        mockReq.body = { ...validVehicle, mileage: 50000 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });

      it('should fail when mileage is negative', async () => {
        mockReq.body = { ...validVehicle, mileage: -100 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.array().some(e => e.msg === 'Mileage must be a non-negative integer')).toBe(true);
      });

      it('should fail when mileage is a float', async () => {
        mockReq.body = { ...validVehicle, mileage: 50000.5 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.array().some(e => e.msg === 'Mileage must be a non-negative integer')).toBe(true);
      });
    });

    describe('cost', () => {
      it('should pass when cost is a valid non-negative number', async () => {
        mockReq.body = { ...validVehicle, cost: 20000.50 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });

      it('should fail when cost is negative', async () => {
        mockReq.body = { ...validVehicle, cost: -500 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.array().some(e => e.msg === 'Cost must be a non-negative number')).toBe(true);
      });
    });

    describe('condition', () => {
      it('should pass when condition is a valid enum value', async () => {
        mockReq.body = { ...validVehicle, condition: VehicleCondition.NEW };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });

      it('should fail when condition is an invalid value', async () => {
        mockReq.body = { ...validVehicle, condition: 'invalid-condition' };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.array().some(e => e.msg.includes('Condition must be one of'))).toBe(true);
      });
    });

    describe('bodyType', () => {
      it('should pass when bodyType is a valid string', async () => {
        mockReq.body = { ...validVehicle, bodyType: 'Sedan' };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });
    });

    describe('transmission', () => {
      it('should pass when transmission is a valid string', async () => {
        mockReq.body = { ...validVehicle, transmission: 'Automatic' };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });
    });

    describe('fuelType', () => {
      it('should pass when fuelType is a valid string', async () => {
        mockReq.body = { ...validVehicle, fuelType: 'Gasoline' };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });
    });

    describe('engineDisplacement', () => {
      it('should pass when engineDisplacement is a valid non-negative number', async () => {
        mockReq.body = { ...validVehicle, engineDisplacement: 1200.5 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });

      it('should fail when engineDisplacement is negative', async () => {
        mockReq.body = { ...validVehicle, engineDisplacement: -10 };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.array().some(e => e.msg === 'Engine displacement must be a non-negative number')).toBe(true);
      });
    });

    describe('category', () => {
      it('should pass when category is a valid string', async () => {
        mockReq.body = { ...validVehicle, category: 'Cruiser' };
        await runMiddleware(mockReq as Request, mockRes as Response, createVehicleValidator);
        const errors = validationResult(mockReq as Request);
        expect(errors.isEmpty()).toBe(true);
      });
    });
  });
});