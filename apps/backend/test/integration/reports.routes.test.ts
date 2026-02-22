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

// Helper to create auth token
const createAuthToken = async (role: UserRole = UserRole.ADMIN) => {
  const jwt = await import('jsonwebtoken');
  return jwt.sign(
    { userId: 'user-1', email: 'test@example.com', role },
    'test-secret',
    { expiresIn: '1h' }
  );
};

describe('Reports Routes Integration', () => {
  let adminToken: string;
  let salespersonToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    adminToken = await createAuthToken(UserRole.ADMIN);
    salespersonToken = await createAuthToken(UserRole.SALESPERSON);
  });

  describe('GET /api/reports/revenue', () => {
    it('should return revenue report for admin', async () => {
      const mockReport = {
        total_revenue: '50000.00',
        sale_count: '2',
        average_sale_price: '25000.00',
      };
      mockQuery.mockResolvedValueOnce({ rows: [mockReport] });

      const response = await request(app)
        .get('/api/reports/revenue?from=2024-01-01&to=2024-12-31')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({
        totalRevenue: 50000,
        saleCount: 2,
        averageSalePrice: 25000,
      });
      
      // Verify query parameters
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('AND sale_date >= $1'),
        [expect.any(Date), expect.any(Date)]
      );
    });

    it('should return 403 for salesperson', async () => {
      const response = await request(app)
        .get('/api/reports/revenue')
        .set('Authorization', `Bearer ${salespersonToken}`);

      expect(response.status).toBe(403);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/reports/revenue');
      expect(response.status).toBe(401);
    });

    it('should return 400 for invalid date format', async () => {
      const response = await request(app)
        .get('/api/reports/revenue?from=invalid-date')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Invalid start date format');
    });
  });

  describe('GET /api/reports/monthly-sales', () => {
    it('should return monthly sales stats for admin', async () => {
      const mockStats = [
        { month: '2024-01-01', sales_count: '5', revenue: '100000.00' },
        { month: '2024-02-01', sales_count: '3', revenue: '75000.00' },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockStats });

      const response = await request(app)
        .get('/api/reports/monthly-sales')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([
        { month: '2024-01', salesCount: 5, revenue: 100000 },
        { month: '2024-02', salesCount: 3, revenue: 75000 },
      ]);
    });

    it('should return 403 for salesperson', async () => {
      const response = await request(app)
        .get('/api/reports/monthly-sales')
        .set('Authorization', `Bearer ${salespersonToken}`);

      expect(response.status).toBe(403);
    });
  });
});