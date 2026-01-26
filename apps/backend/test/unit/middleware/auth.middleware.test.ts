import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@car-dealership/shared-types';

// Mock jwtUtils
const mockVerify = vi.fn();
vi.mock('../../../src/utils/jwt.util.js', () => ({
  jwtUtils: {
    verify: (...args: unknown[]) => mockVerify(...args),
  },
}));

// Import after mocking
const { authenticateToken, requireRole } = await import('../../../src/middleware/auth.middleware.js');
const { AppError } = await import('../../../src/middleware/errorHandler.middleware.js');

describe('auth.middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    mockNext = vi.fn();
  });

  describe('authenticateToken', () => {
    it('should call next with error when no authorization header', () => {
      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as vi.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should call next with error when authorization header has no token', () => {
      mockReq.headers = { authorization: 'Bearer ' };

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as vi.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should set user on request when token is valid', () => {
      const mockDecodedToken = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };
      mockVerify.mockReturnValue(mockDecodedToken);
      mockReq.headers = { authorization: 'Bearer valid-token' };

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockReq.user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      });
      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should call next with error when token verification fails', () => {
      mockVerify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      mockReq.headers = { authorization: 'Bearer invalid-token' };

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as vi.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Invalid or expired token');
    });

    it('should handle Bearer prefix case correctly', () => {
      const mockDecodedToken = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.SALESPERSON,
      };
      mockVerify.mockReturnValue(mockDecodedToken);
      mockReq.headers = { authorization: 'Bearer my-valid-token' };

      authenticateToken(mockReq as Request, mockRes as Response, mockNext);

      expect(mockVerify).toHaveBeenCalledWith('my-valid-token');
    });
  });

  describe('requireRole', () => {
    it('should call next with error when no user on request', () => {
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as vi.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should call next with error when user role is not allowed', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.SALESPERSON,
      };
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
      const error = (mockNext as vi.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Insufficient permissions');
    });

    it('should call next without error when user has required role', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.ADMIN,
      };
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should allow user when role is in multiple allowed roles', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.SALESPERSON,
      };
      const middleware = requireRole(UserRole.ADMIN, UserRole.SALESPERSON);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it('should reject user when role is not in any allowed roles', () => {
      mockReq.user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.SALESPERSON,
      };
      const middleware = requireRole(UserRole.ADMIN);

      middleware(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(AppError));
    });
  });
});
