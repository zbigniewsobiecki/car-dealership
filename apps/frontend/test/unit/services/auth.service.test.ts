import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../../../src/services/auth.service';

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error with invalid credentials', async () => {
      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();
    });
  });

  describe('getMe', () => {
    it('should return current user when authenticated', async () => {
      localStorage.setItem('token', 'valid-token');

      const result = await authService.getMe();

      expect(result.email).toBe('test@example.com');
    });

    it('should throw error when not authenticated', async () => {
      localStorage.removeItem('token');

      await expect(authService.getMe()).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should resolve without error', async () => {
      await expect(authService.logout()).resolves.toBeUndefined();
    });
  });
});
