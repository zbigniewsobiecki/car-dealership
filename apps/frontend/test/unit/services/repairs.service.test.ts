import { describe, it, expect, beforeEach } from 'vitest';
import { repairsService } from '../../../src/services/repairs.service';
import { RepairStatus } from '@car-dealership/shared-types';

describe('repairsService', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('getAll', () => {
    it('should return all repairs', async () => {
      const result = await repairsService.getAll();

      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.pagination).toBeDefined();
    });

    it('should build query params from filters', async () => {
      const filters = {
        vehicleId: 'vehicle-1',
        status: RepairStatus.IN_PROGRESS,
        technician: 'Mike Johnson',
      };

      const result = await repairsService.getAll(filters);

      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should support pagination parameters', async () => {
      const result = await repairsService.getAll({ page: 1, limit: 20 });

      expect(result.pagination).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('getById', () => {
    it('should return a repair by id', async () => {
      const result = await repairsService.getById('repair-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('repair-1');
    });
  });

  describe('create', () => {
    it('should create a new repair', async () => {
      const newRepair = {
        vehicleId: 'vehicle-1',
        customerId: 'customer-1',
        description: 'Brake replacement',
        status: RepairStatus.PENDING,
        cost: 500,
        startDate: new Date().toISOString(),
        technician: 'John Smith',
      };

      const result = await repairsService.create(newRepair);

      expect(result).toBeDefined();
      expect(result.id).toBe('new-repair-id');
    });
  });

  describe('update', () => {
    it('should update a repair', async () => {
      const updateData = { cost: 175, status: RepairStatus.COMPLETED };

      const result = await repairsService.update('repair-1', updateData);

      expect(result).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete a repair', async () => {
      await expect(repairsService.delete('repair-1')).resolves.toBeUndefined();
    });
  });
});
