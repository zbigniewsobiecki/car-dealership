import { Request, Response } from 'express';
import { vehiclesService } from '../services/vehicles.service.js';
import { CrudController } from './CrudController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { VehicleStatus, VehicleCondition, VehicleType } from '@car-dealership/shared-types';
import { Vehicle, CreateVehicleDto, UpdateVehicleDto } from '@car-dealership/shared-types';

interface VehicleFilters {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: VehicleStatus;
  condition?: VehicleCondition;
  type?: VehicleType;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

class VehiclesController extends CrudController<Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleFilters> {
  constructor() {
    super(vehiclesService);
  }

  /**
   * Custom filter extraction for vehicles with all the specific filter fields
   */
  protected extractFilters(req: Request): VehicleFilters {
    return {
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
      sortOrder: req.query.sortOrder === 'asc' ? 'ASC' : req.query.sortOrder === 'desc' ? 'DESC' : undefined,
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };
  }

  /**
   * Get vehicle statistics
   */
  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await vehiclesService.getStats();
    return this.ok(res, stats);
  });

  /**
   * Get recent vehicles
   */
  getRecent = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const vehicles = await vehiclesService.getRecent(limit);
    return this.ok(res, vehicles);
  });
}

export const vehiclesController = new VehiclesController();