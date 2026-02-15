import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole, RepairStatus } from '@car-dealership/shared-types';

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

// Sample repair row for mocking
const createMockRepairRow = (overrides = {}) => ({
  id: 'repair-1',
  vehicle_id: 'vehicle-1',
  customer_id: 'customer-1',
  description: 'Oil change and brake inspection',
  status: RepairStatus.PENDING,
  cost: '150.00',
  start_date: new Date('2024-01-01'),
  end_date: null,
  technician: 'John Doe',
  notes: 'Test repair',
  created_at: new Date(),
  updated_at: new Date(),
  created_by: 'user-1',
  full_count: '2',
  ...overrides,
});

describe('Repairs Routes Integration', () => {
  let authToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    authToken = await createAuthToken();
  });

  describe('GET /api/repairs', () => {
    it('should return all repairs', async () => {
      const mockRepairs = [
        createMockRepairRow(),
        createMockRepairRow({ id: 'repair-2', vehicle_id: 'vehicle-2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRepairs });

      const response = await request(app)
        .get('/api/repairs')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/repairs');

      expect(response.status).toBe(401);
    });

    it('should filter repairs by vehicleId', async () => {
      const mockRepairs = [createMockRepairRow({ vehicle_id: 'vehicle-1' })];
      mockQuery.mockResolvedValueOnce({ rows: mockRepairs });

      const response = await request(app)
        .get('/api/repairs?vehicleId=vehicle-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].vehicleId).toBe('vehicle-1');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('vehicle_id = $1'),
        expect.arrayContaining(['vehicle-1'])
      );
    });

    it('should filter repairs by customerId', async () => {
      const mockRepairs = [createMockRepairRow({ customer_id: 'customer-1' })];
      mockQuery.mockResolvedValueOnce({ rows: mockRepairs });

      const response = await request(app)
        .get('/api/repairs?customerId=customer-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].customerId).toBe('customer-1');
    });

    it('should filter repairs by status', async () => {
      const mockRepairs = [createMockRepairRow({ status: RepairStatus.COMPLETED })];
      mockQuery.mockResolvedValueOnce({ rows: mockRepairs });

      const response = await request(app)
        .get('/api/repairs?status=completed')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].status).toBe(RepairStatus.COMPLETED);
    });

    it('should filter repairs by technician', async () => {
      const mockRepairs = [createMockRepairRow({ technician: 'John Doe' })];
      mockQuery.mockResolvedValueOnce({ rows: mockRepairs });

      const response = await request(app)
        .get('/api/repairs?technician=John%20Doe')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].technician).toBe('John Doe');
    });
  });

  describe('GET /api/repairs/:id', () => {
    it('should return a repair by id', async () => {
      const mockRepair = createMockRepairRow();
      mockQuery.mockResolvedValueOnce({ rows: [mockRepair] });

      const response = await request(app)
        .get('/api/repairs/repair-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('repair-1');
    });

    it('should return 404 for non-existent repair', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/repairs/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Repair not found');
    });
  });

  describe('POST /api/repairs', () => {
    it('should create a new repair', async () => {
      mockQuery.mockImplementation((sql) => {
        // Vehicle exists check
        if (sql.includes('SELECT * FROM vehicles WHERE id = $1')) {
          return Promise.resolve({ rows: [{ id: 'vehicle-1' }] });
        }
        // Customer exists check
        if (sql.includes('SELECT * FROM customers WHERE id = $1')) {
          return Promise.resolve({ rows: [{ id: 'customer-1' }] });
        }
        // Insert repair
        if (sql.includes('INSERT INTO repairs')) {
          return Promise.resolve({
            rows: [createMockRepairRow({ id: 'new-repair', status: RepairStatus.PENDING })],
          });
        }
        // Update vehicle status
        if (sql.includes('UPDATE vehicles SET')) {
          return Promise.resolve({ rows: [{ id: 'vehicle-1', status: 'maintenance' }] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/repairs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'vehicle-1',
          customerId: 'customer-1',
          description: 'Brake repair',
          status: RepairStatus.PENDING,
          cost: 300,
          startDate: '2024-01-01',
          technician: 'John Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBe('new-repair');
    });

    it('should return 404 if vehicle does not exist', async () => {
      mockQuery.mockImplementation((sql) => {
        if (sql.includes('SELECT * FROM vehicles WHERE id = $1')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/repairs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'nonexistent',
          customerId: 'customer-1',
          description: 'Brake repair',
          status: RepairStatus.PENDING,
          cost: 300,
          startDate: '2024-01-01',
        });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Vehicle not found');
    });

    it('should return 404 if customer does not exist', async () => {
      mockQuery.mockImplementation((sql) => {
        if (sql.includes('SELECT * FROM vehicles WHERE id = $1')) {
          return Promise.resolve({ rows: [{ id: 'vehicle-1' }] });
        }
        if (sql.includes('SELECT * FROM customers WHERE id = $1')) {
          return Promise.resolve({ rows: [] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .post('/api/repairs')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          vehicleId: 'vehicle-1',
          customerId: 'nonexistent',
          description: 'Brake repair',
          status: RepairStatus.PENDING,
          cost: 300,
          startDate: '2024-01-01',
        });

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Customer not found');
    });
  });

  describe('PATCH /api/repairs/:id', () => {
    it('should update a repair', async () => {
      mockQuery.mockImplementation((sql) => {
        if (sql.includes('SELECT * FROM repairs WHERE id = $1')) {
          return Promise.resolve({ rows: [createMockRepairRow()] });
        }
        if (sql.includes('UPDATE repairs SET')) {
          return Promise.resolve({ rows: [createMockRepairRow({ status: RepairStatus.COMPLETED })] });
        }
        if (sql.includes('UPDATE vehicles SET')) {
          return Promise.resolve({ rows: [{ id: 'vehicle-1', status: 'available' }] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .patch('/api/repairs/repair-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: RepairStatus.COMPLETED });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(RepairStatus.COMPLETED);
    });

    it('should return 404 for non-existent repair', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .patch('/api/repairs/nonexistent')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: RepairStatus.COMPLETED });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/repairs/:id', () => {
    it('should delete a repair', async () => {
      mockQuery.mockImplementation((sql) => {
        if (sql.includes('SELECT * FROM repairs WHERE id = $1')) {
          return Promise.resolve({ rows: [createMockRepairRow()] });
        }
        if (sql.includes('DELETE FROM repairs')) {
          return Promise.resolve({ rowCount: 1 });
        }
        if (sql.includes('UPDATE vehicles SET')) {
          return Promise.resolve({ rows: [{ id: 'vehicle-1', status: 'available' }] });
        }
        return Promise.resolve({ rows: [] });
      });

      const response = await request(app)
        .delete('/api/repairs/repair-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Repair deleted successfully');
    });

    it('should return 404 for non-existent repair', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .delete('/api/repairs/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});
