import { Request, Response, NextFunction } from 'express';
import { salesService } from '../services/sales.service.js';

export const salesController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const sales = await salesService.getAll();
      res.json({
        success: true,
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await salesService.getById(req.params.id);
      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await salesService.create(req.body);
      res.status(201).json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const sale = await salesService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await salesService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Sale deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await salesService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMonthlyStats(req: Request, res: Response, next: NextFunction) {
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
