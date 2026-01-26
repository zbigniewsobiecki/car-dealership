import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { UserRole } from '@car-dealership/shared-types';

// Mock the config before importing the module
vi.mock('../../../src/config/jwt.js', () => ({
  jwtConfig: {
    secret: 'test-jwt-secret',
    expiresIn: '1h',
    refreshSecret: 'test-refresh-secret',
    refreshExpiresIn: '7d',
  },
}));

// Import after mocking
const { jwtUtils } = await import('../../../src/utils/jwt.util.js');

describe('jwtUtils', () => {
  const mockPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    role: UserRole.ADMIN,
  };

  describe('sign', () => {
    it('should create a valid JWT token', () => {
      const token = jwtUtils.sign(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include payload data in token', () => {
      const token = jwtUtils.sign(mockPayload);
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should set expiration time', () => {
      const token = jwtUtils.sign(mockPayload);
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp! > decoded.iat!).toBe(true);
    });
  });

  describe('signRefreshToken', () => {
    it('should create a valid refresh token', () => {
      const token = jwtUtils.signRefreshToken(mockPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include payload data in refresh token', () => {
      const token = jwtUtils.signRefreshToken(mockPayload);
      const decoded = jwt.decode(token) as jwt.JwtPayload;

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should create different tokens than sign()', () => {
      const accessToken = jwtUtils.sign(mockPayload);
      const refreshToken = jwtUtils.signRefreshToken(mockPayload);

      expect(accessToken).not.toBe(refreshToken);
    });
  });

  describe('verify', () => {
    it('should verify a valid token and return payload', () => {
      const token = jwtUtils.sign(mockPayload);
      const decoded = jwtUtils.verify(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should throw error for invalid token', () => {
      expect(() => jwtUtils.verify('invalid-token')).toThrow();
    });

    it('should throw error for tampered token', () => {
      const token = jwtUtils.sign(mockPayload);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => jwtUtils.verify(tamperedToken)).toThrow();
    });

    it('should throw error for token signed with wrong secret', () => {
      const wrongToken = jwt.sign(mockPayload, 'wrong-secret');

      expect(() => jwtUtils.verify(wrongToken)).toThrow();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token and return payload', () => {
      const token = jwtUtils.signRefreshToken(mockPayload);
      const decoded = jwtUtils.verifyRefreshToken(token);

      expect(decoded.userId).toBe(mockPayload.userId);
      expect(decoded.email).toBe(mockPayload.email);
      expect(decoded.role).toBe(mockPayload.role);
    });

    it('should throw error for invalid refresh token', () => {
      expect(() => jwtUtils.verifyRefreshToken('invalid-token')).toThrow();
    });

    it('should throw error when verifying access token as refresh token', () => {
      const accessToken = jwtUtils.sign(mockPayload);

      // Access token is signed with different secret, so it should fail
      expect(() => jwtUtils.verifyRefreshToken(accessToken)).toThrow();
    });

    it('should throw error when verifying refresh token with verify()', () => {
      const refreshToken = jwtUtils.signRefreshToken(mockPayload);

      // Refresh token is signed with different secret
      expect(() => jwtUtils.verify(refreshToken)).toThrow();
    });
  });
});
