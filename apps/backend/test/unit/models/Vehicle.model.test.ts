import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleStatus } from '@car-dealership/shared-types';

// Mock the db module
const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../../../src/models/db.js', () => ({
  query: mockQuery,
}));

// Import VehicleModel after mocking db
import { VehicleModel } from '../../../src/models/Vehicle.model.js';

describe('VehicleModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findByVin', () => {
    it('should return vehicle when VIN exists', async () => {
      const mockVehicleRow = {
        id: 'vehicle-1',
        vin: 'VIN123456789',
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        type: 'car',
        status: VehicleStatus.AVAILABLE,
        condition: 'excellent',
        mileage: 15000,
        price: 25000,
        color: 'Blue',
        transmission: 'automatic',
        fuel_type: 'gasoline',
        engine_displacement: 2.5,
        body_type: 'sedan',
        category: 'standard',
        location: 'Main Lot',
        notes: 'Well maintained',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValue({ rows: [mockVehicleRow] });

      const result = await VehicleModel.findByVin('VIN123456789');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM vehicles WHERE vin = $1'),
        ['VIN123456789']
      );
      expect(result).toEqual({
        id: mockVehicleRow.id,
        vin: mockVehicleRow.vin,
        year: mockVehicleRow.year,
        make: mockVehicleRow.make,
        model: mockVehicleRow.model,
        type: mockVehicleRow.type,
        status: mockVehicleRow.status,
        condition: mockVehicleRow.condition,
        mileage: mockVehicleRow.mileage,
        price: mockVehicleRow.price,
        color: mockVehicleRow.color,
        transmission: mockVehicleRow.transmission,
        fuelType: mockVehicleRow.fuel_type,
        engineDisplacement: mockVehicleRow.engine_displacement,
        bodyType: mockVehicleRow.body_type,
        category: mockVehicleRow.category,
        location: mockVehicleRow.location,
        notes: mockVehicleRow.notes,
        createdAt: mockVehicleRow.created_at,
        updatedAt: mockVehicleRow.updated_at,
      });
    });

    it('should return null when VIN does not exist', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await VehicleModel.findByVin('NONEXISTENT');

      expect(result).toBeNull();
    });
  });

  describe('findRecent', () => {
    it('should return recent vehicles with specified limit', async () => {
      const mockRows = [
        {
          id: 'vehicle-1',
          vin: 'VIN111',
          year: 2023,
          make: 'Honda',
          model: 'Civic',
          type: 'car',
          status: VehicleStatus.AVAILABLE,
          condition: 'excellent',
          mileage: 5000,
          price: 28000,
          color: 'Red',
          transmission: 'manual',
          fuel_type: 'gasoline',
          engine_displacement: 2.0,
          body_type: 'sedan',
          category: 'sport',
          location: 'Showroom',
          notes: null,
          created_at: new Date('2024-02-01'),
          updated_at: new Date('2024-02-01'),
        },
        {
          id: 'vehicle-2',
          vin: 'VIN222',
          year: 2022,
          make: 'Toyota',
          model: 'Camry',
          type: 'car',
          status: VehicleStatus.AVAILABLE,
          condition: 'good',
          mileage: 15000,
          price: 25000,
          color: 'Blue',
          transmission: 'automatic',
          fuel_type: 'gasoline',
          engine_displacement: 2.5,
          body_type: 'sedan',
          category: 'standard',
          location: 'Main Lot',
          notes: null,
          created_at: new Date('2024-01-15'),
          updated_at: new Date('2024-01-15'),
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await VehicleModel.findRecent(2);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM vehicles ORDER BY created_at DESC LIMIT $1'),
        [2]
      );
      expect(result).toHaveLength(2);
      expect(result[0].vin).toBe('VIN111');
      expect(result[1].vin).toBe('VIN222');
    });

    it('should return fewer vehicles if limit exceeds available vehicles', async () => {
      const mockRows = [
        {
          id: 'vehicle-1',
          vin: 'VIN111',
          year: 2023,
          make: 'Honda',
          model: 'Civic',
          type: 'car',
          status: VehicleStatus.AVAILABLE,
          condition: 'excellent',
          mileage: 5000,
          price: 28000,
          color: 'Red',
          transmission: 'manual',
          fuel_type: 'gasoline',
          engine_displacement: 2.0,
          body_type: 'sedan',
          category: 'sport',
          location: 'Showroom',
          notes: null,
          created_at: new Date('2024-02-01'),
          updated_at: new Date('2024-02-01'),
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await VehicleModel.findRecent(10);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM vehicles ORDER BY created_at DESC LIMIT $1'),
        [10]
      );
      expect(result).toHaveLength(1);
    });
  });

  describe('getStats', () => {
    it('should return correct vehicle statistics', async () => {
      const mockStatsRow = {
        total: '100',
        available: '75',
        sold: '15',
        reserved: '8',
        maintenance: '2',
        total_inventory_value: '2500000',
      };

      mockQuery.mockResolvedValue({ rows: [mockStatsRow] });

      const result = await VehicleModel.getStats();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) as total')
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("COUNT(*) FILTER (WHERE status = 'available') as available")
      );
      expect(result).toEqual({
        total: 100,
        available: 75,
        sold: 15,
        reserved: 8,
        maintenance: 2,
        total_inventory_value: 2500000,
      });
    });

    it('should handle zero inventory', async () => {
      const mockStatsRow = {
        total: '0',
        available: '0',
        sold: '0',
        reserved: '0',
        maintenance: '0',
        total_inventory_value: '0',
      };

      mockQuery.mockResolvedValue({ rows: [mockStatsRow] });

      const result = await VehicleModel.getStats();

      expect(result).toEqual({
        total: 0,
        available: 0,
        sold: 0,
        reserved: 0,
        maintenance: 0,
        total_inventory_value: 0,
      });
    });
  });

  describe('buildWhereClause', () => {
    it('should build WHERE clause for make filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ make: 'Toyota' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/LOWER\(make\) = LOWER\(\$\d+\)/),
        expect.arrayContaining(['Toyota'])
      );
    });

    it('should build WHERE clause for model filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ model: 'Camry' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/LOWER\(model\) = LOWER\(\$\d+\)/),
        expect.arrayContaining(['Camry'])
      );
    });

    it('should build WHERE clause for type filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ type: 'car' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/LOWER\(type\) = LOWER\(\$\d+\)/),
        expect.arrayContaining(['car'])
      );
    });

    it('should build WHERE clause for yearMin filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ yearMin: 2020 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/year >= \$\d+/),
        expect.arrayContaining([2020])
      );
    });

    it('should build WHERE clause for yearMax filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ yearMax: 2023 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/year <= \$\d+/),
        expect.arrayContaining([2023])
      );
    });

    it('should build WHERE clause for priceMin filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ priceMin: 20000 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/price >= \$\d+/),
        expect.arrayContaining([20000])
      );
    });

    it('should build WHERE clause for priceMax filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ priceMax: 30000 });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/price <= \$\d+/),
        expect.arrayContaining([30000])
      );
    });

    it('should build WHERE clause for search filter', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({ search: 'Toyota' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/LOWER\(make\) LIKE LOWER\(\$\d+\) OR LOWER\(model\) LIKE LOWER\(\$\d+\) OR LOWER\(vin\) LIKE LOWER\(\$\d+\)/),
        expect.arrayContaining(['%Toyota%'])
      );
    });

    it('should build WHERE clause with multiple filters', async () => {
      const mockRows = [];
      mockQuery.mockResolvedValue({ rows: mockRows, rowCount: 0 });

      await VehicleModel.findAll({
        make: 'Toyota',
        yearMin: 2020,
        yearMax: 2023,
        priceMin: 20000,
        priceMax: 30000,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringMatching(/LOWER\(make\) = LOWER\(\$\d+\)/),
        expect.arrayContaining(['Toyota', 2020, 2023, 20000, 30000])
      );
    });
  });
});
