import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole, SaleStatus, VehicleStatus } from '@car-dealership/shared-types';

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

// Sample sale row for mocking
const createMockSaleRow = (overrides = {}) => ({
  id: 'sale-1',
  vehicle_id: 'vehicle-1',
  customer_id: 'customer-1',
  salesperson_id: 'user-1',
  sale_price: '25000.00',
  sale_date: new Date(),
  payment_method: 'cash',
  financing_details: null,
  trade_in_vehicle: null,
  trade_in_value: null,
  down_payment: null,
  status: SaleStatus.PENDING,
  notes: null,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

const createMockVehicleRow = () => ({
  id: 'vehicle-1',
  vin: 'ABC123456789',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  color: 'Blue',
  price: '25000.00',
  status: VehicleStatus.AVAILABLE,
  created_at: new Date(),
  updated_at: new Date(),
});

const createMockCustomerRow = () => ({
  id: 'customer-1',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  created_at: new Date(),
  updated_at: new Date(),
});

describe('Sales Routes Integration', () => {
  let authToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    authToken = await createAuthToken();
  });

  describe('GET /api/sales', () => {
    it('should return all sales', async () => {
      const mockSales = [
        createMockSaleRow(),
        createMockSaleRow({ id: 'sale-2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockSales });

      const response = await request(app)
        .get('/api/sales')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/sales');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sales/stats', () => {
    it('should return sales stats', async () => {
      const mockStats = {
        total_sales: '10',
        completed_sales: '6',
        pending_sales: '3',
        total_revenue: '200000',
        average_sale_price: '33333.33',
      };
      mockQuery.mockResolvedValueOnce({ rows: [mockStats] });

      const response = await request(app)
        .get('/api/sales/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('total_sales');
    });
  });

  describe('GET /api/sales/monthly', () => {
    it('should return monthly stats', async () => {
      const mockMonthlyStats = [
        { month: '2024-01', sales_count: '5', revenue: '100000' },
        { month: '2024-02', sales_count: '5', revenue: '100000' },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockMonthlyStats });

      const response = await request(app)
        .get('/api/sales/monthly')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/sales/:id', () => {
    it('should return a sale by id', async () => {
      const mockSale = createMockSaleRow();
      mockQuery.mockResolvedValueOnce({ rows: [mockSale] });

      const response = await request(app)
        .get('/api/sales/sale-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('sale-1');
    });

    it('should return 404 for non-existent sale', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/sales/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Sale not found');
    });
  });

  describe('POST /api/sales', () => {
    it('should create a new sale', async () => {
      // Find vehicle
      mockQuery.mockResolvedValueOnce({ rows: [createMockVehicleRow()] });

      // Find customer
      mockQuery.mockResolvedValueOnce({ rows: [createMockCustomerRow()] });

      // Create sale
      const mockCreatedSale = createMockSaleRow({ id: 'new-sale' });
      mockQuery.mockResolvedValueOnce({ rows: [mockCreatedSale] });

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'vehicle-1',
          customerId: 'customer-1',
          salespersonId: 'user-1',
          salePrice: 25000,
          saleDate: new Date().toISOString(),
          status: SaleStatus.PENDING,
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 if vehicle not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'nonexistent',
          customerId: 'customer-1',
          salespersonId: 'user-1',
          salePrice: 25000,
          saleDate: new Date().toISOString(),
          status: SaleStatus.PENDING,
        });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Vehicle not found');
    });

    it('should return 404 if customer not found', async () => {
      // Find vehicle
      mockQuery.mockResolvedValueOnce({ rows: [createMockVehicleRow()] });

      // Customer not found
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'vehicle-1',
          customerId: 'nonexistent',
          salespersonId: 'user-1',
          salePrice: 25000,
          saleDate: new Date().toISOString(),
          status: SaleStatus.PENDING,
        });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Customer not found');
    });

    it('should update vehicle status when sale is completed', async () => {
      // Find vehicle
      mockQuery.mockResolvedValueOnce({ rows: [createMockVehicleRow()] });

      // Find customer
      mockQuery.mockResolvedValueOnce({ rows: [createMockCustomerRow()] });

      // Create sale
      const mockCreatedSale = createMockSaleRow({ status: SaleStatus.COMPLETED });
      mockQuery.mockResolvedValueOnce({ rows: [mockCreatedSale] });

      // Update vehicle status
      mockQuery.mockResolvedValueOnce({ rows: [createMockVehicleRow()] });

      const response = await request(app)
        .post('/api/sales')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'vehicle-1',
          customerId: 'customer-1',
          salespersonId: 'user-1',
          salePrice: 25000,
          saleDate: new Date().toISOString(),
          status: SaleStatus.COMPLETED,
        });

      expect(response.status).toBe(201);
      // Verify vehicle update was called
      expect(mockQuery).toHaveBeenCalledTimes(4);
    });
  });

  describe('PUT /api/sales/:id', () => {
    it('should update a sale', async () => {
      // Find existing sale
      mockQuery.mockResolvedValueOnce({ rows: [createMockSaleRow()] });

      // Update sale
      const mockUpdatedSale = createMockSaleRow({ sale_price: '28000.00' });
      mockQuery.mockResolvedValueOnce({ rows: [mockUpdatedSale] });

      const response = await request(app)
        .put('/api/sales/sale-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ salePrice: 28000 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent sale', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .put('/api/sales/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ salePrice: 28000 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/sales/:id', () => {
    it('should delete a sale', async () => {
      // Find sale
      mockQuery.mockResolvedValueOnce({ rows: [createMockSaleRow()] });

      // Delete sale
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const response = await request(app)
        .delete('/api/sales/sale-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent sale', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .delete('/api/sales/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
