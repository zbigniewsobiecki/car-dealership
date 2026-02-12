import { Request, Response, NextFunction } from 'express';
import { vehiclesService } from '../services/vehicles.service.js';
import { VehicleStatus, VehicleCondition, PaginatedResponse, Vehicle } from '@car-dealership/shared-types';

export const vehiclesController = {
  async getRecent(req: Request, res: Response, next: NextFunction) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const vehicles = await vehiclesService.getRecent(days);
      res.json({
        success: true,
        data: vehicles,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const filters = {
        make: req.query.make as string | undefined,
        model: req.query.model as string | undefined,
        yearMin: req.query.yearMin ? parseInt(req.query.yearMin as string) : undefined,
        yearMax: req.query.yearMax ? parseInt(req.query.yearMax as string) : undefined,
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
        status: req.query.status as VehicleStatus | undefined,
        condition: req.query.condition as VehicleCondition | undefined,
        search: req.query.search as string | undefined,
        page,
        limit,
      };

      const { vehicles, total } = await vehiclesService.getAll(filters);
      
      const response: PaginatedResponse<Vehicle> = {
        data: vehicles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };

      res.json({
        success: true,
        ...response,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehiclesService.getById(req.params.id);
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehiclesService.create(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehiclesService.update(req.params.id, req.body);
      res.json({
        success: true,
        data: vehicle,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await vehiclesService.delete(req.params.id);
      res.json({
        success: true,
        message: 'Vehicle deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await vehiclesService.getStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  },
};
