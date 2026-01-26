import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole } from '@car-dealership/shared-types';

// Mock environment config
vi.mock('../../src/config/env.js', () => ({
  env: {
    nodeEnv: 'test',
    cors: { origin: '*' },
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h',
      refreshSecret: 'test-refresh-secret',
      refreshExpiresIn: '7d',
    },
  },
}));

// Mock jwt config
vi.mock('../../src/config/jwt.js', () => ({
  jwtConfig: {
    secret: 'test-secret',
    expiresIn: '1h',
    refreshSecret: 'test-refresh-secret',
    refreshExpiresIn: '7d',
  },
}));

// Mock database
const mockQuery = vi.fn();
vi.mock('../../src/models/db.js', () => ({
  query: (...args: unknown[]) => mockQuery(...args),
}));

// Import app after mocking
const { default: app } = await import('../../src/app.js');

describe('Auth Routes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUserRow = {
        id: 'user-1',
        email: 'test@example.com',
        password_hash: '$2a$10$8K1p/a0dR1xqM8K3S5G5oeP7lCK7fBf5b5wN5r5d5o5n5e5r5y5.',
        first_name: 'Test',
        last_name: 'User',
        role: UserRole.ADMIN,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // First query: findByEmail
      mockQuery.mockResolvedValueOnce({ rows: [mockUserRow] });

      // Mock bcrypt comparison - we need to hash a known password
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);
      mockUserRow.password_hash = hashedPassword;

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      // User not found
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'password' });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Invalid email or password');
    });

    it('should return 401 for inactive account', async () => {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const mockUserRow = {
        id: 'user-1',
        email: 'inactive@example.com',
        password_hash: hashedPassword,
        first_name: 'Inactive',
        last_name: 'User',
        role: UserRole.SALESPERSON,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUserRow] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'inactive@example.com', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Account is inactive');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens successfully', async () => {
      // Create a valid refresh token
      const jwt = await import('jsonwebtoken');
      const refreshToken = jwt.sign(
        { userId: 'user-1', email: 'test@example.com', role: UserRole.ADMIN },
        'test-refresh-secret',
        { expiresIn: '7d' }
      );

      const mockUserRow = {
        id: 'user-1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: UserRole.ADMIN,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUserRow] });

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return 403 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' });

      expect(response.status).toBe(403);
      expect(response.body.error.message).toBe('Invalid or expired refresh token');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user when authenticated', async () => {
      const jwt = await import('jsonwebtoken');
      const token = jwt.sign(
        { userId: 'user-1', email: 'test@example.com', role: UserRole.ADMIN },
        'test-secret',
        { expiresIn: '1h' }
      );

      const mockUserRow = {
        id: 'user-1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: UserRole.ADMIN,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUserRow] });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error.message).toBe('Authentication required');
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body.error.message).toBe('Invalid or expired token');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register new user when admin is authenticated', async () => {
      const jwt = await import('jsonwebtoken');
      const token = jwt.sign(
        { userId: 'admin-1', email: 'admin@example.com', role: UserRole.ADMIN },
        'test-secret',
        { expiresIn: '1h' }
      );

      // First query: check if user exists
      mockQuery.mockResolvedValueOnce({ rows: [] });

      // Second query: create user
      const mockCreatedUser = {
        id: 'new-user-1',
        email: 'newuser@example.com',
        first_name: 'New',
        last_name: 'User',
        role: UserRole.SALESPERSON,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockQuery.mockResolvedValueOnce({ rows: [mockCreatedUser] });

      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          role: UserRole.SALESPERSON,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newuser@example.com');
    });

    it('should return 403 when non-admin tries to register', async () => {
      const jwt = await import('jsonwebtoken');
      const token = jwt.sign(
        { userId: 'user-1', email: 'user@example.com', role: UserRole.SALESPERSON },
        'test-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .post('/api/auth/register')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          role: UserRole.SALESPERSON,
        });

      expect(response.status).toBe(403);
      expect(response.body.error.message).toBe('Insufficient permissions');
    });
  });
});
