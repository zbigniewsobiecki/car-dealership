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

      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.pagination).toBeDefined();
    });

    it('should build query params from filters', async () => {
      const filters = {
        vehicleId: 'vehicle-1',
        status: RepairStatus.IN_PROGRESS,
        page: 1,
        limit: 10,
      };

      const result = await repairsService.getAll(filters);

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
        description: 'Oil change',
        status: RepairStatus.PENDING,
        startDate: new Date().toISOString(),
      };

      const result = await repairsService.create(newRepair);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update a repair', async () => {
      const updateData = { status: RepairStatus.COMPLETED };

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
