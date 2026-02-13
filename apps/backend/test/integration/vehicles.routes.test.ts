import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { UserRole, VehicleStatus, VehicleCondition, VehicleType } from '@car-dealership/shared-types';

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

// Sample vehicle row for mocking
const createMockVehicleRow = (overrides = {}) => ({
  id: 'vehicle-1',
  vin: '1234567890ABCDEF1',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  color: 'Blue',
  mileage: 15000,
  price: '25000.00',
  cost: '20000.00',
  type: VehicleType.CAR,
  status: VehicleStatus.AVAILABLE,
  condition: VehicleCondition.USED,
  body_type: 'Sedan',
  transmission: 'Automatic',
  fuel_type: 'Gasoline',
  engine: null,
  drivetrain: null,
  exterior_color: null,
  interior_color: null,
  features: null,
  description: null,
  images: null,
  date_acquired: null,
  created_at: new Date(),
  updated_at: new Date(),
  created_by: 'user-1',
  full_count: '2',
  ...overrides,
});

describe('Vehicles Routes Integration', () => {
  let authToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();
    authToken = await createAuthToken();
  });

  describe('GET /api/vehicles', () => {
    it('should return all vehicles', async () => {
      const mockVehicles = [
        createMockVehicleRow(),
        createMockVehicleRow({ id: 'vehicle-2', vin: 'DEF45678901234567' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockVehicles });

      const response = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(2);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app).get('/api/vehicles');

      expect(response.status).toBe(401);
    });

    it('should filter vehicles by make', async () => {
      const mockVehicles = [createMockVehicleRow({ make: 'Toyota' })];
      mockQuery.mockResolvedValueOnce({ rows: mockVehicles });

      const response = await request(app)
        .get('/api/vehicles?make=Toyota')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
      expect(mockQuery).toHaveBeenCalled();
    });

    it('should filter vehicles by type', async () => {
      const mockVehicles = [createMockVehicleRow({ type: VehicleType.MOTORCYCLE })];
      mockQuery.mockResolvedValueOnce({ rows: mockVehicles });

      const response = await request(app)
        .get('/api/vehicles?type=motorcycle')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].type).toBe(VehicleType.MOTORCYCLE);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LOWER(type) = LOWER($1)'),
        expect.arrayContaining(['motorcycle'])
      );
    });
  });

  describe('GET /api/vehicles/stats', () => {
    it('should return vehicle stats with numeric values', async () => {
      const mockStats = {
        total: '10',
        available: '5',
        sold: '3',
        reserved: '1',
        maintenance: '1',
        total_inventory_value: '250000.00',
      };
      mockQuery.mockResolvedValueOnce({ rows: [mockStats] });

      const response = await request(app)
        .get('/api/vehicles/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({
        total: 10,
        available: 5,
        sold: 3,
        reserved: 1,
        maintenance: 1,
        total_inventory_value: 250000,
      });
    });
  });

  describe('GET /api/vehicles/recent', () => {
    it('should return recently added vehicles', async () => {
      const mockVehicles = [
        createMockVehicleRow({ id: 'v-1', created_at: new Date('2024-01-02') }),
        createMockVehicleRow({ id: 'v-2', created_at: new Date('2024-01-01') }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockVehicles });

      const response = await request(app)
        .get('/api/vehicles/recent?limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].id).toBe('v-1');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC LIMIT $1'),
        [2]
      );
    });

    it('should use default limit of 5 if not provided', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      await request(app)
        .get('/api/vehicles/recent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1'),
        [5]
      );
    });
  });

  describe('GET /api/vehicles/:id', () => {
    it('should return a vehicle by id', async () => {
      const mockVehicle = createMockVehicleRow();
      mockQuery.mockResolvedValueOnce({ rows: [mockVehicle] });

      const response = await request(app)
        .get('/api/vehicles/vehicle-1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('vehicle-1');
    });

    it('should return 404 for non-existent vehicle', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .get('/api/vehicles/nonexistent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error.message).toBe('Vehicle not found');
    });
  });
});