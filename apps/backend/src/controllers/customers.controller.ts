import { Request, Response } from 'express';
import { customersService } from '../services/customers.service.js';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

class CustomersController extends BaseController {
  getAll = asyncHandler(async (_req: Request, res: Response) => {
    const { data: customers } = await customersService.getAll({});
    return this.ok(res, customers);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.getById(req.params.id);
    return this.ok(res, customer);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.create(req.body, req.user!.userId);
    return this.created(res, customer);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const customer = await customersService.update(req.params.id, req.body);
    return this.ok(res, customer);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const hardDelete = req.query.hard === 'true';
    
    // Only admins can hard delete
    if (hardDelete && req.user?.role !== 'admin') {
      throw new AppError(403, 'Only admins can perform hard deletes');
    }

    await customersService.delete(req.params.id, hardDelete);
    return this.message(
      res, 
      hardDelete ? 'Customer permanently deleted' : 'Customer soft deleted'
    );
  });

  getSales = asyncHandler(async (req: Request, res: Response) => {
    const sales = await customersService.getSales(req.params.id);
    return this.ok(res, sales);
  });
}

export const customersController = new CustomersController();