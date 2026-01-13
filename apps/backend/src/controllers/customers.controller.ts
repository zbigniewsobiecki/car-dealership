import { Request, Response, NextFunction } from 'express';
import { customersService } from '../services/customers.service.js';

export const customersController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await customersService.getAll();
      res.json({
        success: true,
        data: customers,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await customersService.getById(req.params.id);
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await customersService.create(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await customersService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await customersService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Customer deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getSales(req: Request, res: Response, next: NextFunction) {
    try {
      const sales = await customersService.getSales(req.params.id);
      res.json({
        success: true,
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  },
};
