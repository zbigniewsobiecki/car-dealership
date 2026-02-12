import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../../src/store/authStore';
import { UserRole } from '@car-dealership/shared-types';

describe('authStore', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    // Reset the store state
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  describe('initial state', () => {
    it('should have null user and token initially', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should set user, token and isAuthenticated on login', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, 'access-token', 'refresh-token');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('access-token');
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should store token in localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, 'access-token', 'refresh-token');
      });

      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'access-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'refresh-token');
    });

    it('should handle login without refresh token', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, 'access-token');
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('access-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'access-token');
    });
  });

  describe('logout', () => {
    it('should clear user, token and isAuthenticated on logout', () => {
      const { result } = renderHook(() => useAuthStore());

      // First login
      act(() => {
        result.current.login(mockUser, 'access-token', 'refresh-token');
      });

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should remove tokens from localStorage', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, 'access-token', 'refresh-token');
      });

      act(() => {
        result.current.logout();
      });

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });
  });

  describe('updateUser', () => {
    it('should update user data', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login(mockUser, 'access-token');
      });

      const updatedUser = { ...mockUser, firstName: 'Updated' };

      act(() => {
        result.current.updateUser(updatedUser);
      });

      expect(result.current.user?.firstName).toBe('Updated');
    });
  });
});
