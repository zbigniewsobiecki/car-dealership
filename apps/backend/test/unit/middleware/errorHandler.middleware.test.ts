import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { AppError, errorHandler } from '../../../src/middleware/errorHandler.middleware.js';

describe('errorHandler.middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('AppError', () => {
    it('should create an error with status code and message', () => {
      const error = new AppError(400, 'Bad Request');

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Bad Request');
      expect(error.isOperational).toBe(true);
    });

    it('should create an error with custom isOperational flag', () => {
      const error = new AppError(500, 'Server Error', false);

      expect(error.isOperational).toBe(false);
    });

    it('should be an instance of Error', () => {
      const error = new AppError(404, 'Not Found');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError with correct status and message', () => {
      const error = new AppError(400, 'Validation failed');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Validation failed',
        },
      });
    });

    it('should handle 401 Unauthorized AppError', () => {
      const error = new AppError(401, 'Authentication required');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Authentication required',
        },
      });
    });

    it('should handle 403 Forbidden AppError', () => {
      const error = new AppError(403, 'Insufficient permissions');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Insufficient permissions',
        },
      });
    });

    it('should handle 404 Not Found AppError', () => {
      const error = new AppError(404, 'Resource not found');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Resource not found',
        },
      });
    });

    it('should handle generic Error with 500 status', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: 'Internal server error',
        },
      });
    });

    it('should log unexpected errors to console', () => {
      const error = new Error('Unexpected error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Unexpected error:', error);
    });

    it('should not log AppErrors to console', () => {
      const error = new AppError(400, 'Expected error');

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
