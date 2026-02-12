import { Request, Response, NextFunction } from 'express';
import { jwtUtils } from '../utils/jwt.util.js';
import { AppError } from './errorHandler.middleware.js';
import { UserRole } from '@car-dealership/shared-types';

export const authenticateToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError(401, 'Authentication required'));
  }

  try {
    const decoded = jwtUtils.verify(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return next(new AppError(403, 'Invalid or expired token'));
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request,  _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Insufficient permissions'));
    }

    next();
  };
};
