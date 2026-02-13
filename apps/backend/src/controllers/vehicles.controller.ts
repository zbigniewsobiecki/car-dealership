import { Request, Response } from 'express';
import { vehiclesService } from '../services/vehicles.service.js';
import { VehicleStatus, VehicleCondition, VehicleType } from '@car-dealership/shared-types';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class VehiclesController extends BaseController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
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
      type: req.query.type as VehicleType | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      page,
      limit,
    };

    const { data: vehicles, total } = await vehiclesService.getAll(filters);
    return this.paginate(res, vehicles, page, limit, total);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await vehiclesService.getById(req.params.id);
    return this.ok(res, vehicle);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await vehiclesService.create(req.body, req.user!.userId);
    return this.created(res, vehicle);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const vehicle = await vehiclesService.update(req.params.id, req.body);
    return this.ok(res, vehicle);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await vehiclesService.delete(req.params.id);
    return this.message(res, 'Vehicle deleted successfully');
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await vehiclesService.getStats();
    return this.ok(res, stats);
  });

  getRecent = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const vehicles = await vehiclesService.getRecent(limit);
    return this.ok(res, vehicles);
  });
}

export const vehiclesController = new VehiclesController();