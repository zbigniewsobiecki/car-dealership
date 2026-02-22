import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaleStatus } from '@car-dealership/shared-types';

// Mock the db module
const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../../../src/models/db.js', () => ({
  query: mockQuery,
}));

// Import SaleModel after mocking db
import { SaleModel } from '../../../src/models/Sale.model.js';

describe('SaleModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findByCustomerId', () => {
    it('should return sales array for given customer', async () => {
      const mockRows = [
        {
          id: 'sale-1',
          customer_id: 'customer-1',
          vehicle_id: 'vehicle-1',
          sale_price: 25000,
          status: SaleStatus.COMPLETED,
          sale_date: new Date('2024-01-15'),
          payment_method: 'cash',
          salesperson_id: 'user-1',
          notes: null,
          created_at: new Date('2024-01-15T10:00:00.000Z'),
          updated_at: new Date('2024-01-15T10:00:00.000Z'),
        },
        {
          id: 'sale-2',
          customer_id: 'customer-1',
          vehicle_id: 'vehicle-2',
          sale_price: 32000,
          status: SaleStatus.PENDING,
          sale_date: new Date('2024-01-20'),
          payment_method: 'credit',
          salesperson_id: 'user-2',
          notes: 'Follow up required',
          created_at: new Date('2024-01-20T10:00:00.000Z'),
          updated_at: new Date('2024-01-20T10:00:00.000Z'),
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await SaleModel.findByCustomerId('customer-1');

      expect(mockQuery).toHaveBeenCalledWith(
        'SELECT * FROM sales WHERE customer_id = $1 ORDER BY created_at DESC',
        ['customer-1']
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'sale-1',
        customerId: 'customer-1',
        vehicleId: 'vehicle-1',
        salePrice: 25000,
        status: SaleStatus.COMPLETED,
        saleDate: new Date('2024-01-15'),
        paymentMethod: 'cash',
        salespersonId: 'user-1',
        notes: null,
        createdAt: new Date('2024-01-15T10:00:00.000Z'),
        updatedAt: new Date('2024-01-15T10:00:00.000Z'),
      });
      expect(result[1].customerId).toBe('customer-1');
    });

    it('should return empty array when customer has no sales', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await SaleModel.findByCustomerId('customer-empty');

      expect(result).toEqual([]);
    });
  });

  describe('getStats', () => {
    it('should return correct sales statistics', async () => {
      const mockRow = {
        total_sales: '150',
        completed_sales: '120',
        pending_sales: '30',
        total_revenue: '4500000',
        average_sale_price: '30000',
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await SaleModel.getStats();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('COUNT(*) as total_sales'));
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("COUNT(*) FILTER (WHERE status = 'completed') as completed_sales"));
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("COUNT(*) FILTER (WHERE status = 'pending') as pending_sales"));
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("COALESCE(SUM(sale_price) FILTER (WHERE status = 'completed'), 0) as total_revenue"));
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("COALESCE(AVG(sale_price) FILTER (WHERE status = 'completed'), 0) as average_sale_price"));

      expect(result).toEqual({
        total_sales: '150',
        completed_sales: '120',
        pending_sales: '30',
        total_revenue: '4500000',
        average_sale_price: '30000',
      });
    });

    it('should handle zero values correctly', async () => {
      const mockRow = {
        total_sales: '0',
        completed_sales: '0',
        pending_sales: '0',
        total_revenue: '0',
        average_sale_price: '0',
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await SaleModel.getStats();

      expect(result).toEqual(mockRow);
    });
  });

  describe('getMonthlyStats', () => {
    it('should return monthly statistics for the last 12 months', async () => {
      const mockRows = [
        {
          month: new Date('2024-02-01'),
          sales_count: '15',
          revenue: '450000',
        },
        {
          month: new Date('2024-01-01'),
          sales_count: '12',
          revenue: '360000',
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await SaleModel.getMonthlyStats();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("DATE_TRUNC('month', sale_date) as month")
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'completed' AND sale_date >= NOW() - INTERVAL '12 months'")
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('GROUP BY DATE_TRUNC(\'month\', sale_date)')
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY month DESC')
      );

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        month: new Date('2024-02-01'),
        sales_count: '15',
        revenue: '450000',
      });
      expect(result[1].month).toEqual(new Date('2024-01-01'));
    });

    it('should return empty array when no sales in the last 12 months', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await SaleModel.getMonthlyStats();

      expect(result).toEqual([]);
    });
  });

  describe('getRevenueReport', () => {
    it('should return revenue report for date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const mockRow = {
        total_revenue: '150000',
        sale_count: '5',
        average_sale_price: '30000',
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await SaleModel.getRevenueReport(startDate, endDate);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COALESCE(SUM(sale_price), 0) as total_revenue'),
        [startDate, endDate]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) as sale_count'),
        [startDate, endDate]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COALESCE(AVG(sale_price), 0) as average_sale_price'),
        [startDate, endDate]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("WHERE status = 'completed'"),
        [startDate, endDate]
      );

      expect(result).toEqual({
        totalRevenue: 150000,
        saleCount: 5,
        averageSalePrice: 30000,
      });
    });

    it('should handle zero revenue correctly', async () => {
      const startDate = new Date('2024-02-01');
      const endDate = new Date('2024-02-29');
      const mockRow = {
        total_revenue: '0',
        sale_count: '0',
        average_sale_price: '0',
      };

      mockQuery.mockResolvedValue({ rows: [mockRow] });

      const result = await SaleModel.getRevenueReport(startDate, endDate);

      expect(result).toEqual({
        totalRevenue: 0,
        saleCount: 0,
        averageSalePrice: 0,
      });
    });
  });

  // Test inheritance from BaseRepository
  describe('inheritance from BaseRepository', () => {
    it('should have BaseRepository methods', () => {
      // Check that SaleModel has methods from BaseRepository
      expect(typeof SaleModel.findById).toBe('function');
      expect(typeof SaleModel.create).toBe('function');
      expect(typeof SaleModel.update).toBe('function');
      expect(typeof SaleModel.delete).toBe('function');
      expect(typeof SaleModel.findAll).toBe('function');
    });
  });
});