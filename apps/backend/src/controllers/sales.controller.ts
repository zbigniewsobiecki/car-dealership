import { Request, Response } from 'express';
import { salesService } from '../services/sales.service.js';
import { CrudController } from './CrudController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { Sale, CreateSaleDto, UpdateSaleDto } from '@car-dealership/shared-types';

class SalesController extends CrudController<Sale, CreateSaleDto, UpdateSaleDto> {
  constructor() {
    super(salesService);
  }

  /**
   * Get sales statistics
   */
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await salesService.getStats();
    return this.ok(res, stats);
  });

  /**
   * Get monthly sales statistics
   */
  getMonthlyStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await salesService.getMonthlyStats();
    return this.ok(res, stats);
  });
}

export const salesController = new SalesController();