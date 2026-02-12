import { describe, it, expect, beforeEach } from 'vitest';
import { vehiclesService } from '../../../src/services/vehicles.service';
import { VehicleStatus } from '@car-dealership/shared-types';

describe('vehiclesService', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('getAll', () => {
    it('should return all vehicles', async () => {
      const result = await vehiclesService.getAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should build query params from filters', async () => {
      const filters = {
        make: 'Toyota',
        status: VehicleStatus.AVAILABLE,
      };

      const result = await vehiclesService.getAll(filters);

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('getById', () => {
    it('should return a vehicle by id', async () => {
      const result = await vehiclesService.getById('vehicle-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('vehicle-1');
    });
  });

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const newVehicle = {
        vin: 'NEW123456789',
        make: 'Ford',
        model: 'Mustang',
        year: 2023,
        color: 'Red',
        price: 45000,
        status: VehicleStatus.AVAILABLE,
      };

      const result = await vehiclesService.create(newVehicle);

      expect(result).toBeDefined();
      expect(result.id).toBe('new-vehicle-id');
    });
  });

  describe('update', () => {
    it('should update a vehicle', async () => {
      const updateData = { price: 26000 };

      const result = await vehiclesService.update('vehicle-1', updateData);

      expect(result).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a vehicle', async () => {
      await expect(vehiclesService.delete('vehicle-1')).resolves.toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should return vehicle stats', async () => {
      const result = await vehiclesService.getStats();

      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('available');
    });
  });
});
