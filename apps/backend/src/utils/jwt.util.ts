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
    return jwt.sign(payload, jwtConfig.secret as jwt.Secret, {
      expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
    });
  },

  signRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, jwtConfig.refreshSecret as jwt.Secret, {
      expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions['expiresIn'],
    });
  },

  verify(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.secret) as JwtPayload;
  },

  verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
  },
};
