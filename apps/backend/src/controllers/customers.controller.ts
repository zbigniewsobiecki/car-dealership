import { Request, Response } from 'express';
import { customersService } from '../services/customers.service.js';
import { CrudController } from './CrudController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';

class CustomersController extends CrudController<Customer, CreateCustomerDto, UpdateCustomerDto> {
  constructor() {
    super(customersService);
  }

  /**
   * Custom delete with hard delete support (admin only)
   */
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

  /**
   * Get all sales for a specific customer
   */
  getSales = asyncHandler(async (req: Request, res: Response) => {
    const sales = await customersService.getSales(req.params.id);
    return this.ok(res, sales);
  });
}

export const customersController = new CustomersController();