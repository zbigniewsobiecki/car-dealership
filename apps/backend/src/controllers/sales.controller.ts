import { Request, Response } from 'express';
import { salesService } from '../services/sales.service.js';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class SalesController extends BaseController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const { data: sales } = await salesService.getAll();
    return this.ok(res, sales);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const sale = await salesService.getById(req.params.id);
    return this.ok(res, sale);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const sale = await salesService.create(req.body);
    return this.created(res, sale);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const sale = await salesService.update(req.params.id, req.body);
    return this.ok(res, sale);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await salesService.delete(req.params.id);
    return this.message(res, 'Sale deleted successfully');
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await salesService.getStats();
    return this.ok(res, stats);
  });

  getMonthlyStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await salesService.getMonthlyStats();
    return this.ok(res, stats);
  });
}

export const salesController = new SalesController();