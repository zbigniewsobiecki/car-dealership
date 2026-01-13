import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';
import { UserRole } from '@car-dealership/shared-types';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export const jwtUtils = {
  sign(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });
  },

  signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.refreshSecret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });
  },

  verify(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret) as JwtPayload;
  },

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
  },
};
