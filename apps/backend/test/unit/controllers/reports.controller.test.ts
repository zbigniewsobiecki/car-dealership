import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

// Mock salesService
const mockSalesService = {
  getRevenueReport: vi.fn(),
};

vi.mock('../../../src/services/sales.service.js', () => ({
  salesService: mockSalesService,
}));

// Import after mocking
const { reportsController } = await import('../../../src/controllers/reports.controller.js');

describe('reportsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();
    req = {
      query: {},
    };
    res = {
      json: vi.fn(),
    };
    next = vi.fn();
  });

  describe('getRevenue', () => {
    it('should return revenue report successfully without query params', async () => {
      const mockReport = {
        totalRevenue: 100000,
        totalSales: 5,
        averageSaleValue: 20000,
      };
      mockSalesService.getRevenueReport.mockResolvedValue(mockReport);

      await reportsController.getRevenue(req as Request, res as Response, next);

      expect(mockSalesService.getRevenueReport).toHaveBeenCalledWith(undefined, undefined);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return revenue report successfully with query params', async () => {
      const from = '2023-01-01';
      const to = '2023-12-31';
      req.query = { from, to };
      
      const mockReport = {
        totalRevenue: 50000,
        totalSales: 2,
        averageSaleValue: 25000,
      };
      mockSalesService.getRevenueReport.mockResolvedValue(mockReport);

      await reportsController.getRevenue(req as Request, res as Response, next);

      expect(mockSalesService.getRevenueReport).toHaveBeenCalledWith(from, to);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReport,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error when service fails', async () => {
      const error = new Error('Database error');
      mockSalesService.getRevenueReport.mockRejectedValue(error);

      await reportsController.getRevenue(req as Request, res as Response, next);

      expect(mockSalesService.getRevenueReport).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with error for invalid from date format', async () => {
      req.query = { from: 'not-a-date' };
      const error = new Error('Invalid start date format');
      mockSalesService.getRevenueReport.mockRejectedValue(error);

      await reportsController.getRevenue(req as Request, res as Response, next);

      expect(mockSalesService.getRevenueReport).toHaveBeenCalledWith('not-a-date', undefined);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with error for invalid to date format', async () => {
      req.query = { to: 'invalid' };
      const error = new Error('Invalid end date format');
      mockSalesService.getRevenueReport.mockRejectedValue(error);

      await reportsController.getRevenue(req as Request, res as Response, next);

      expect(mockSalesService.getRevenueReport).toHaveBeenCalledWith(undefined, 'invalid');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should handle unexpected service data (null)', async () => {
      mockSalesService.getRevenueReport.mockResolvedValue(null);

      await reportsController.getRevenue(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});