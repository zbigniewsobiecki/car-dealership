import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@car-dealership/shared-types';
import { createMockUser, createMockUserWithPassword, createMockCreateUserDto } from '../../factories/user.factory';

// Mock UserModel
const mockUserModel = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
};
vi.mock('../../../src/models/User.model.js', () => ({
  UserModel: mockUserModel,
}));

// Mock password utils
const mockPasswordUtils = {
  hash: vi.fn(),
  compare: vi.fn(),
};
vi.mock('../../../src/utils/password.util.js', () => ({
  passwordUtils: mockPasswordUtils,
}));

// Mock jwt utils
const mockJwtUtils = {
  sign: vi.fn(),
  signRefreshToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
};
vi.mock('../../../src/utils/jwt.util.js', () => ({
  jwtUtils: mockJwtUtils,
}));

// Import after mocking
const { authService } = await import('../../../src/services/auth.service.js');
const { AppError } = await import('../../../src/middleware/errorHandler.middleware.js');

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto = createMockCreateUserDto();
      const createdUser = createMockUser({ email: createUserDto.email });

      mockUserModel.findByEmail.mockResolvedValue(null);
      mockPasswordUtils.hash.mockResolvedValue('hashed-password');
      mockUserModel.create.mockResolvedValue(createdUser);
      mockJwtUtils.sign.mockReturnValue('access-token');
      mockJwtUtils.signRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.register(createUserDto);

      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockPasswordUtils.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(mockUserModel.create).toHaveBeenCalled();
      expect(result.user).toEqual(createdUser);
      expect(result.token).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
    });

    it('should throw error if user already exists', async () => {
      const createUserDto = createMockCreateUserDto();
      const existingUser = createMockUser({ email: createUserDto.email });

      mockUserModel.findByEmail.mockResolvedValue(existingUser);

      await expect(authService.register(createUserDto)).rejects.toThrow(AppError);
      await expect(authService.register(createUserDto)).rejects.toThrow(
        'User with this email already exists'
      );
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userWithPassword = createMockUserWithPassword({ email, isActive: true });

      mockUserModel.findByEmail.mockResolvedValue(userWithPassword);
      mockPasswordUtils.compare.mockResolvedValue(true);
      mockJwtUtils.sign.mockReturnValue('access-token');
      mockJwtUtils.signRefreshToken.mockReturnValue('refresh-token');

      const result = await authService.login(email, password);

      expect(mockUserModel.findByEmail).toHaveBeenCalledWith(email);
      expect(mockPasswordUtils.compare).toHaveBeenCalledWith(
        password,
        userWithPassword.passwordHash
      );
      expect(result.token).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findByEmail.mockResolvedValue(null);

      await expect(authService.login('nonexistent@example.com', 'password')).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw error if account is inactive', async () => {
      const userWithPassword = createMockUserWithPassword({ isActive: false });
      mockUserModel.findByEmail.mockResolvedValue(userWithPassword);

      await expect(
        authService.login(userWithPassword.email, 'password')
      ).rejects.toThrow('Account is inactive');
    });

    it('should throw error if password is invalid', async () => {
      const userWithPassword = createMockUserWithPassword({ isActive: true });
      mockUserModel.findByEmail.mockResolvedValue(userWithPassword);
      mockPasswordUtils.compare.mockResolvedValue(false);

      await expect(
        authService.login(userWithPassword.email, 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const user = createMockUser({ isActive: true });
      const decodedPayload = { userId: user.id, email: user.email, role: user.role };

      mockJwtUtils.verifyRefreshToken.mockReturnValue(decodedPayload);
      mockUserModel.findById.mockResolvedValue(user);
      mockJwtUtils.sign.mockReturnValue('new-access-token');
      mockJwtUtils.signRefreshToken.mockReturnValue('new-refresh-token');

      const result = await authService.refreshToken('valid-refresh-token');

      expect(mockJwtUtils.verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(mockUserModel.findById).toHaveBeenCalledWith(user.id);
      expect(result.token).toBe('new-access-token');
      expect(result.refreshToken).toBe('new-refresh-token');
    });

    it('should throw error if refresh token is invalid', async () => {
      mockJwtUtils.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.refreshToken('invalid-token')).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });

    it('should throw error if user not found', async () => {
      const decodedPayload = { userId: 'nonexistent', email: 'test@example.com', role: UserRole.ADMIN };
      mockJwtUtils.verifyRefreshToken.mockReturnValue(decodedPayload);
      mockUserModel.findById.mockResolvedValue(null);

      await expect(authService.refreshToken('valid-token')).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });

    it('should throw error if user is inactive', async () => {
      const user = createMockUser({ isActive: false });
      const decodedPayload = { userId: user.id, email: user.email, role: user.role };

      mockJwtUtils.verifyRefreshToken.mockReturnValue(decodedPayload);
      mockUserModel.findById.mockResolvedValue(user);

      await expect(authService.refreshToken('valid-token')).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });
  });

  describe('getMe', () => {
    it('should return user by id', async () => {
      const user = createMockUser();
      mockUserModel.findById.mockResolvedValue(user);

      const result = await authService.getMe(user.id);

      expect(mockUserModel.findById).toHaveBeenCalledWith(user.id);
      expect(result).toEqual(user);
    });

    it('should throw error if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      await expect(authService.getMe('nonexistent-id')).rejects.toThrow('User not found');
    });
  });
});
