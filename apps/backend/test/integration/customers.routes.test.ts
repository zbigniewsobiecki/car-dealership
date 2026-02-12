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

// Sample customer row for mocking
const createMockCustomerRow = (overrides = {}) => ({
  id: 'customer-1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '555-1234',
  address: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip_code: '90210',
  notes: null,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: 'user-1',
  ...overrides,
});

describe('Customers Routes Integration', () => {
  let authToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    authToken = await createAuthToken();
  });

  describe('GET /api/customers', () => {
    it('should return all customers', async () => {
      const mockCustomers = [
        createMockCustomerRow(),
        createMockCustomerRow({ id: 'customer-2', first_name: 'Jane' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockCustomers });

      const response = await request(app)
        .get('/api/customers')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/customers');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/customers/:id', () => {
    it('should return a customer by id', async () => {
      const mockCustomer = createMockCustomerRow();
      mockQuery.mockResolvedValueOnce({ rows: [mockCustomer] });

      const response = await request(app)
        .get('/api/customers/customer-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('customer-1');
    });

    it('should return 404 for non-existent customer', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/customers/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Customer not found');
    });
  });

  describe('POST /api/customers', () => {
    it('should create a new customer', async () => {
      const mockCreatedCustomer = createMockCustomerRow({ id: 'new-customer' });
      mockQuery.mockResolvedValueOnce({ rows: [mockCreatedCustomer] });

      const response = await request(app)
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '555-1234',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('John');
    });
  });

  describe('PUT /api/customers/:id', () => {
    it('should update a customer', async () => {
      const mockUpdatedCustomer = createMockCustomerRow({ phone: '555-9999' });
      mockQuery.mockResolvedValueOnce({ rows: [mockUpdatedCustomer] });

      const response = await request(app)
        .put('/api/customers/customer-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: '555-9999' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent customer', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/customers/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: '555-9999' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/customers/:id', () => {
    it('should soft delete a customer', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await request(app)
        .delete('/api/customers/customer-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify the query was an UPDATE instead of DELETE
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE customers SET deleted_at'),
        expect.any(Array)
      );
    });

    it('should return 404 for non-existent customer', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const response = await request(app)
        .delete('/api/customers/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 404 when trying to get a soft-deleted customer', async () => {
      // Mock findById returning nothing because of the WHERE deleted_at IS NULL clause
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/customers/customer-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/customers/:id/sales', () => {
    it('should return sales for a customer', async () => {
      // First query: find customer
      mockQuery.mockResolvedValueOnce({ rows: [createMockCustomerRow()] });

      // Second query: find sales
      const mockSales = [
        {
          id: 'sale-1',
          vehicle_id: 'vehicle-1',
          customer_id: 'customer-1',
          salesperson_id: 'user-1',
          sale_price: '25000.00',
          sale_date: new Date(),
          status: 'completed',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockSales });

      const response = await request(app)
        .get('/api/customers/customer-1/sales')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 if customer not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/customers/nonexistent/sales')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
