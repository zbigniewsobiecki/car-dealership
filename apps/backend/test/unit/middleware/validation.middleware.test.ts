import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError, Result } from 'express-validator';
import { validate } from '../../../src/middleware/validation.middleware.js';
import { AppError } from '../../../src/middleware/errorHandler.middleware.js';

// Mock express-validator
vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}));

describe('validation middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      body: {},
      params: {},
      query: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe('successful validation', () => {
    it('should call next() when validation passes', () => {
      const mockValidationResult = {
        isEmpty: () => true,
        array: () => [],
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      validate(mockReq as Request, mockRes as Response, mockNext);

      expect(validationResult).toHaveBeenCalledWith(mockReq);
      expect(mockNext).toHaveBeenCalledWith();
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should not throw errors when no validation errors exist', () => {
      const mockValidationResult = {
        isEmpty: () => true,
        array: () => [],
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      expect(() => {
        validate(mockReq as Request, mockRes as Response, mockNext);
      }).not.toThrow();
    });

    it('should check validationResult with request object', () => {
      const mockValidationResult = {
        isEmpty: () => true,
        array: () => [],
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      validate(mockReq as Request, mockRes as Response, mockNext);

      expect(validationResult).toHaveBeenCalledWith(mockReq);
    });
  });

  describe('validation errors', () => {
    it('should throw AppError when validation fails with single error', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Name is required' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      expect(() => {
        validate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow(AppError);

      expect(() => {
        validate(mockReq as Request, mockRes as Response, mockNext);
      }).toThrow('Name is required');
    });

    it('should throw AppError with 400 status code', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Invalid input' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(400);
      }
    });

    it('should combine multiple validation errors with comma separator', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Name is required' },
        { msg: 'Email is invalid' },
        { msg: 'Age must be a number' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe('Name is required, Email is invalid, Age must be a number');
      }
    });

    it('should not call next() when validation fails', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Validation failed' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
      } catch (error) {
        // Expected error
      }

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should extract all error messages from validation result', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Error 1' },
        { msg: 'Error 2' },
        { msg: 'Error 3' },
        { msg: 'Error 4' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('Error 1, Error 2, Error 3, Error 4');
      }
    });
  });

  describe('field-specific validation errors', () => {
    it('should handle field validation errors', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Invalid email format', type: 'field', path: 'email' },
        { msg: 'Password too short', type: 'field', path: 'password' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('Invalid email format, Password too short');
      }
    });

    it('should handle nested field validation errors', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Invalid address.city', type: 'field', path: 'address.city' },
        { msg: 'Invalid address.zip', type: 'field', path: 'address.zip' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('Invalid address.city, Invalid address.zip');
      }
    });
  });

  describe('integration with express-validator validators', () => {
    it('should work with body validation errors', () => {
      mockReq.body = {
        name: '',
        email: 'invalid-email',
      };

      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Name cannot be empty' },
        { msg: 'Email must be valid' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toContain('Name cannot be empty');
        expect((error as AppError).message).toContain('Email must be valid');
      }
    });

    it('should work with params validation errors', () => {
      mockReq.params = {
        id: 'invalid-uuid',
      };

      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'ID must be a valid UUID' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('ID must be a valid UUID');
      }
    });

    it('should work with query validation errors', () => {
      mockReq.query = {
        page: 'not-a-number',
        limit: '-5',
      };

      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Page must be a positive integer' },
        { msg: 'Limit must be greater than 0' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('Page must be a positive integer, Limit must be greater than 0');
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty error messages', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: '' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('');
      }
    });

    it('should handle whitespace-only error messages', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: '   ' },
        { msg: '\t\n' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('   , \t\n');
      }
    });

    it('should handle errors with special characters in messages', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Invalid format: expected "YYYY-MM-DD"' },
        { msg: 'Value must be >= 0 && <= 100' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('Invalid format: expected "YYYY-MM-DD", Value must be >= 0 && <= 100');
      }
    });

    it('should handle very long error messages', () => {
      const longMessage = 'A'.repeat(1000);
      const mockErrors: Partial<ValidationError>[] = [
        { msg: longMessage },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe(longMessage);
        expect((error as AppError).message.length).toBe(1000);
      }
    });

    it('should handle duplicate error messages', () => {
      const mockErrors: Partial<ValidationError>[] = [
        { msg: 'Field is required' },
        { msg: 'Field is required' },
        { msg: 'Field is required' },
      ];

      const mockValidationResult = {
        isEmpty: () => false,
        array: () => mockErrors,
      } as unknown as Result<ValidationError>;

      vi.mocked(validationResult).mockReturnValue(mockValidationResult);

      try {
        validate(mockReq as Request, mockRes as Response, mockNext);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect((error as AppError).message).toBe('Field is required, Field is required, Field is required');
      }
    });
  });
});
