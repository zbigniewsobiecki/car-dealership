import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { validate } from '../../../src/middleware/validation.middleware';
import { validationResult } from 'express-validator';
import { AppError } from '../../../src/middleware/errorHandler.middleware';

vi.mock('express-validator', () => ({
  validationResult: vi.fn(),
}));

describe('validation.middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {};
    mockRes = {};
    mockNext = vi.fn();
  });

  it('should call next when there are no validation errors', () => {
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => true,
    } as unknown as ReturnType<typeof validationResult>);

    validate(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it('should throw AppError when there are validation errors', () => {
    const mockErrors = [
      { msg: 'Invalid email' },
      { msg: 'Password too short' },
    ];
    vi.mocked(validationResult).mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors,
    } as unknown as ReturnType<typeof validationResult>);

    expect(() => validate(mockReq as Request, mockRes as Response, mockNext)).toThrow(AppError);
    
    try {
      validate(mockReq as Request, mockRes as Response, mockNext);
    } catch (error: unknown) {
      const appError = error as AppError;
      expect(appError.statusCode).toBe(400);
      expect(appError.message).toBe('Invalid email, Password too short');
    }
  });
});