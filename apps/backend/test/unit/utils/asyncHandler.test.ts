import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../../../src/utils/asyncHandler.js';

describe('asyncHandler', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    mockReq = {
      params: {},
      query: {},
      body: {},
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };

    mockNext = vi.fn();
  });

  describe('successful async handlers', () => {
    it('should execute async handler without errors', async () => {
      const handler = asyncHandler(async (req, res) => {
        res.json({ success: true });
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ success: true });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should allow handler to call next() explicitly', async () => {
      const handler = asyncHandler(async (req, res, next) => {
        next();
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should handle async operations that resolve successfully', async () => {
      const handler = asyncHandler(async (req, res) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        res.status(200).json({ message: 'Success' });
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Success' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle handlers that return void', async () => {
      const handler = asyncHandler(async () => {
        // Do nothing
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass request parameters to handler', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { name: 'Test' };

      const handler = asyncHandler(async (req, res) => {
        expect(req.params.id).toBe('123');
        expect(req.body.name).toBe('Test');
        res.json({ id: req.params.id, name: req.body.name });
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ id: '123', name: 'Test' });
    });
  });

  describe('error handling', () => {
    it('should catch thrown errors and pass to next()', async () => {
      const error = new Error('Test error');
      const handler = asyncHandler(async () => {
        throw error;
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('should catch rejected promises and pass to next()', async () => {
      const error = new Error('Async error');
      const handler = asyncHandler(async () => {
        await Promise.reject(error);
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle errors thrown in async operations', async () => {
      const handler = asyncHandler(async () => {
        await new Promise((resolve, reject) => {
          setTimeout(() => reject(new Error('Timeout error')), 10);
        });
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const errorArg = vi.mocked(mockNext).mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('Timeout error');
    });

    it('should handle custom error objects', async () => {
      class CustomError extends Error {
        statusCode: number;
        constructor(message: string, statusCode: number) {
          super(message);
          this.statusCode = statusCode;
        }
      }

      const customError = new CustomError('Not found', 404);
      const handler = asyncHandler(async () => {
        throw customError;
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(customError);
      const errorArg = vi.mocked(mockNext).mock.calls[0][0] as CustomError;
      expect(errorArg.statusCode).toBe(404);
    });

    it('should handle string errors', async () => {
      const handler = asyncHandler(async () => {
        throw 'String error';
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith('String error');
    });

    it('should handle errors from database operations', async () => {
      const dbError = new Error('Database connection failed');
      const handler = asyncHandler(async () => {
        // Simulate database call
        await Promise.reject(dbError);
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockNext).toHaveBeenCalledWith(dbError);
    });

    it('should not call response methods when error is thrown', async () => {
      const handler = asyncHandler(async (req, res) => {
        res.status(200); // This gets called
        throw new Error('Error after status');
        // res.json() never gets called
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('return value wrapping', () => {
    it('should wrap Promise.resolve correctly', async () => {
      const handler = asyncHandler(async (req, res) => {
        return Promise.resolve(res.json({ data: 'test' }));
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ data: 'test' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle synchronous return values', async () => {
      const handler = asyncHandler((req, res) => {
        res.json({ sync: true });
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith({ sync: true });
    });

    it('should handle undefined return value', async () => {
      const handler = asyncHandler(async () => {
        return undefined;
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle null return value', async () => {
      const handler = asyncHandler(async () => {
        return null;
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical controller pattern', async () => {
      const handler = asyncHandler(async (req, res) => {
        const id = req.params.id;
        // Simulate async data fetch
        const data = await Promise.resolve({ id, name: 'Test Entity' });
        res.status(200).json({ success: true, data });
      });

      mockReq.params = { id: '123' };

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: { id: '123', name: 'Test Entity' },
      });
    });

    it('should handle service layer errors', async () => {
      const serviceError = new Error('Service validation failed');
      const handler = asyncHandler(async (req, res) => {
        // Simulate service call that throws
        await Promise.reject(serviceError);
        res.json({ success: true });
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockNext).toHaveBeenCalledWith(serviceError);
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should handle multiple async operations', async () => {
      const handler = asyncHandler(async (req, res) => {
        const result1 = await Promise.resolve('data1');
        const result2 = await Promise.resolve('data2');
        const result3 = await Promise.resolve('data3');
        res.json({ result1, result2, result3 });
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockRes.json).toHaveBeenCalledWith({
        result1: 'data1',
        result2: 'data2',
        result3: 'data3',
      });
    });

    it('should catch errors in the middle of multiple async operations', async () => {
      const handler = asyncHandler(async (req, res) => {
        await Promise.resolve('step1');
        await Promise.reject(new Error('step2 failed'));
        await Promise.resolve('step3'); // This should not execute
        res.json({ success: true });
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const errorArg = vi.mocked(mockNext).mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('step2 failed');
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should handle conditional error throwing', async () => {
      const handler = asyncHandler(async (req, res) => {
        const id = req.params.id;
        if (!id) {
          throw new Error('ID is required');
        }
        res.json({ id });
      });

      mockReq.params = {};

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const errorArg = vi.mocked(mockNext).mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('ID is required');
    });
  });

  describe('edge cases', () => {
    it('should handle handlers with very long async chains', async () => {
      const handler = asyncHandler(async (req, res) => {
        let result = 0;
        for (let i = 0; i < 100; i++) {
          result = await Promise.resolve(result + 1);
        }
        res.json({ count: result });
      });

      handler(mockReq as Request, mockRes as Response, mockNext);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockRes.json).toHaveBeenCalledWith({ count: 100 });
    });

    it('should properly handle re-thrown errors', async () => {
      const originalError = new Error('Original error');
      const handler = asyncHandler(async () => {
        try {
          throw originalError;
        } catch (err) {
          throw new Error(`Wrapped: ${(err as Error).message}`);
        }
      });

      await handler(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
      const errorArg = vi.mocked(mockNext).mock.calls[0][0] as Error;
      expect(errorArg.message).toBe('Wrapped: Original error');
    });
  });
});
