import { describe, it, expect, beforeEach, vi } from 'vitest';
import { repairsService } from '../../../src/services/repairs.service';
import api from '../../../src/services/api';
import { RepairStatus, CreateRepairDto, UpdateRepairDto } from '@car-dealership/shared-types';

vi.mock('../../../src/services/api');

describe('repairsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all repairs with filters', async () => {
      const mockResponse = { data: [], pagination: { total: 0 } };
      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      const filters = {
        vehicleId: 'v1',
        customerId: 'c1',
        status: RepairStatus.PENDING,
        technician: 'John',
        page: 2,
        limit: 20
      };

      const result = await repairsService.getAll(filters);

      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/repairs?'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('vehicleId=v1'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('customerId=c1'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('status=pending'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('technician=John'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('limit=20'));
      expect(result).toEqual(mockResponse);
    });

    it('should return all repairs without filters', async () => {
      const mockResponse = { data: [], pagination: { total: 0 } };
      vi.mocked(api.get).mockResolvedValue({ data: mockResponse });

      const result = await repairsService.getAll();

      expect(api.get).toHaveBeenCalledWith('/repairs?');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getById', () => {
    it('should return a repair by id', async () => {
      const mockRepair = { id: '1', description: 'Oil change' };
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockRepair } });

      const result = await repairsService.getById('1');

      expect(api.get).toHaveBeenCalledWith('/repairs/1');
      expect(result).toEqual(mockRepair);
    });
  });

  describe('create', () => {
    it('should create a new repair', async () => {
      const newRepair = { vehicleId: 'v1', customerId: 'c1', description: 'Brakes' };
      const mockResponse = { id: '2', ...newRepair };
      vi.mocked(api.post).mockResolvedValue({ data: { data: mockResponse } });

      const result = await repairsService.create(newRepair as CreateRepairDto);

      expect(api.post).toHaveBeenCalledWith('/repairs', newRepair);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a repair', async () => {
      const updateData = { status: RepairStatus.COMPLETED };
      const mockResponse = { id: '1', status: RepairStatus.COMPLETED };
      vi.mocked(api.patch).mockResolvedValue({ data: { data: mockResponse } });

      const result = await repairsService.update('1', updateData as UpdateRepairDto);

      expect(api.patch).toHaveBeenCalledWith('/repairs/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a repair', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await repairsService.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/repairs/1');
    });
  });
});