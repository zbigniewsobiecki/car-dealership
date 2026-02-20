import { describe, it, expect, beforeEach, vi } from 'vitest';
import { salesService } from '../../../src/services/sales.service';
import api from '../../../src/services/api';
import { CreateSaleDto, UpdateSaleDto } from '@car-dealership/shared-types';

vi.mock('../../../src/services/api');

describe('salesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all sales', async () => {
      const mockSales = [{ id: '1', amount: 1000 }];
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockSales } });

      const result = await salesService.getAll();

      expect(api.get).toHaveBeenCalledWith('/sales');
      expect(result).toEqual(mockSales);
    });
  });

  describe('getById', () => {
    it('should return a sale by id', async () => {
      const mockSale = { id: '1', amount: 1000 };
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockSale } });

      const result = await salesService.getById('1');

      expect(api.get).toHaveBeenCalledWith('/sales/1');
      expect(result).toEqual(mockSale);
    });
  });

  describe('create', () => {
    it('should create a new sale', async () => {
      const newSale = { vehicleId: 'v1', customerId: 'c1', salePrice: 20000 };
      const mockResponse = { id: '2', ...newSale };
      vi.mocked(api.post).mockResolvedValue({ data: { data: mockResponse } });

      const result = await salesService.create(newSale as CreateSaleDto);

      expect(api.post).toHaveBeenCalledWith('/sales', newSale);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a sale', async () => {
      const updateData = { salePrice: 21000 };
      const mockResponse = { id: '1', salePrice: 21000 };
      vi.mocked(api.put).mockResolvedValue({ data: { data: mockResponse } });

      const result = await salesService.update('1', updateData as UpdateSaleDto);

      expect(api.put).toHaveBeenCalledWith('/sales/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a sale', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await salesService.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/sales/1');
    });
  });

  describe('getStats', () => {
    it('should return sales stats', async () => {
      const mockStats = { total: 100 };
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockStats } });

      const result = await salesService.getStats();

      expect(api.get).toHaveBeenCalledWith('/sales/stats');
      expect(result).toEqual(mockStats);
    });
  });

  describe('getMonthlyStats', () => {
    it('should return monthly sales stats', async () => {
      const mockStats = [{ month: 'Jan', total: 10 }];
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockStats } });

      const result = await salesService.getMonthlyStats();

      expect(api.get).toHaveBeenCalledWith('/sales/stats/monthly');
      expect(result).toEqual(mockStats);
    });
  });
});