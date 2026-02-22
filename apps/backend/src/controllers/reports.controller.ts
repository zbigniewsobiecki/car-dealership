import { Request, Response, NextFunction } from 'express';
import { salesService } from '../services/sales.service.js';

export const reportsController = {
  async getRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const { from, to } = req.query;
      
      const report = await salesService.getRevenueReport(
        from as string | undefined,
        to as string | undefined
      );

      res.json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMonthlyStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await salesService.getMonthlyStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};