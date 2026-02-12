import { UserModel } from '../models/User.model.js';
import { passwordUtils } from '../utils/password.util.js';
import { jwtUtils } from '../utils/jwt.util.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { CreateUserDto, AuthResponse } from '@car-dealership/shared-types';

export const authService = {
  async register(data: CreateUserDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(400, 'User with this email already exists');
    }

    // Hash password
    const passwordHash = await passwordUtils.hash(data.password);

    // Create user
    const user = await UserModel.create({
      ...data,
      passwordHash,
    });

    // Generate tokens
    const token = jwtUtils.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = jwtUtils.signRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      token,
      refreshToken,
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new AppError(401, 'Account is inactive');
    }

    // Verify password
    const isPasswordValid = await passwordUtils.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    // Generate tokens
    const token = jwtUtils.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = jwtUtils.signRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password hash from response
    const { passwordHash: _passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
      refreshToken,
    };
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const decoded = jwtUtils.verifyRefreshToken(refreshToken);

      // Get user from database to ensure they still exist and are active
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        throw new AppError(401, 'User not found');
      }

      if (!user.isActive) {
        throw new AppError(401, 'Account is inactive');
      }

      // Generate new tokens
      const newToken = jwtUtils.sign({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      const newRefreshToken = jwtUtils.signRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        user,
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AppError(403, 'Invalid or expired refresh token');
    }
  },

  async getMe(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  },
};
