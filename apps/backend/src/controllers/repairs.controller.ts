import { Request, Response } from 'express';
import { repairsService } from '../services/repairs.service.js';
import { RepairStatus } from '@car-dealership/shared-types';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

class RepairsController extends BaseController {
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filters = {
      vehicleId: req.query.vehicleId as string | undefined,
      customerId: req.query.customerId as string | undefined,
      status: req.query.status as RepairStatus | undefined,
      technician: req.query.technician as string | undefined,
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
    const repair = await repairsService.create(req.body);
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
}

export const repairsController = new RepairsController();
