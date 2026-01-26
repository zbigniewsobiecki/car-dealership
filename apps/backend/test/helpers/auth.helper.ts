import { jwtUtils, JwtPayload } from '../../src/utils/jwt.util.js';
import { UserRole } from '@car-dealership/shared-types';

export const createTestToken = (
  overrides: Partial<JwtPayload> = {}
): string => {
  const payload: JwtPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    ...overrides,
  };
  return jwtUtils.sign(payload);
};

export const createTestRefreshToken = (
  overrides: Partial<JwtPayload> = {}
): string => {
  const payload: JwtPayload = {
    userId: 'test-user-id',
    email: 'test@example.com',
    role: UserRole.ADMIN,
    ...overrides,
  };
  return jwtUtils.signRefreshToken(payload);
};
