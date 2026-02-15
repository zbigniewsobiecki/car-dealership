import { Request, Response } from 'express';
import { repairsService } from '../services/repairs.service.js';
import { RepairStatus } from '@car-dealership/shared-types';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class RepairsController extends BaseController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const sortOrder = req.query.sortOrder as string | undefined;
    const filters = {
      vehicleId: req.query.vehicleId as string | undefined,
      customerId: req.query.customerId as string | undefined,
      status: req.query.status as RepairStatus | undefined,
      dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
      dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as string | undefined,
      sortOrder: sortOrder?.toUpperCase() as 'ASC' | 'DESC' | undefined,
      page,
      limit,
    };

    const { data: repairs, total } = await repairsService.getAll(filters);
    return this.paginate(res, repairs, page, limit, total);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const repair = await repairsService.getById(req.params.id);
    return this.ok(res, repair);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const repair = await repairsService.create(req.body, req.user!.userId);
    return this.created(res, repair);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const repair = await repairsService.update(req.params.id, req.body);
    return this.ok(res, repair);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    await repairsService.delete(req.params.id);
    return this.message(res, 'Repair deleted successfully');
  });

  getStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await repairsService.getStats();
    return this.ok(res, stats);
  });

  getActive = asyncHandler(async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const repairs = await repairsService.getActive(limit);
    return this.ok(res, repairs);
  });

  getByVehicleId = asyncHandler(async (req: Request, res: Response) => {
    const repairs = await repairsService.getByVehicleId(req.params.vehicleId);
    return this.ok(res, repairs);
  });

  getByCustomerId = asyncHandler(async (req: Request, res: Response) => {
    const repairs = await repairsService.getByCustomerId(req.params.customerId);
    return this.ok(res, repairs);
  });
}

export const repairsController = new RepairsController();
