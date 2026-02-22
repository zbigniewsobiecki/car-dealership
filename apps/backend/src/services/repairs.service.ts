import { RepairModel } from '../models/Repair.model.js';
import { VehicleModel } from '../models/Vehicle.model.js';
import { CustomerModel } from '../models/Customer.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { Repair, CreateRepairDto, UpdateRepairDto, VehicleStatus, RepairStatus } from '@car-dealership/shared-types';
import { BaseService } from './BaseService.js';

class RepairsService extends BaseService<Repair, CreateRepairDto, UpdateRepairDto> {
  constructor() {
    super(RepairModel, 'Repair');
  }

  /**
   * Check if a vehicle has any other active repairs (excluding the given repair ID)
   */
  private async hasOtherActiveRepairs(vehicleId: string, excludeRepairId?: string): Promise<boolean> {
    const { data: repairs } = await RepairModel.findAll({
      vehicleId,
      status: RepairStatus.PENDING
    });

    const { data: inProgressRepairs } = await RepairModel.findAll({
      vehicleId,
      status: RepairStatus.IN_PROGRESS
    });

    const allActiveRepairs = [...repairs, ...inProgressRepairs];

    if (excludeRepairId) {
      return allActiveRepairs.some(repair => repair.id !== excludeRepairId);
    }

    return allActiveRepairs.length > 0;
  }

  async create(data: CreateRepairDto) {
    // Verify vehicle exists
    const vehicle = await VehicleModel.findById(data.vehicleId);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    // Verify customer exists
    const customer = await CustomerModel.findById(data.customerId);
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }

    // Create repair
    const repair = await super.create(data);

    // Update vehicle status if repair is active
    if (data.status === RepairStatus.PENDING || data.status === RepairStatus.IN_PROGRESS) {
      await VehicleModel.update(data.vehicleId, { status: VehicleStatus.MAINTENANCE });
    }

    return repair;
  }

  async update(id: string, data: UpdateRepairDto) {
    const existing = await this.getById(id);

    // If status is being changed to IN_PROGRESS, update vehicle status
    if (data.status === RepairStatus.IN_PROGRESS && existing.status !== RepairStatus.IN_PROGRESS) {
      await VehicleModel.update(existing.vehicleId, { status: VehicleStatus.MAINTENANCE });
    }

    // If status is being changed to COMPLETED or CANCELLED, check if vehicle should be available
    if (
      (data.status === RepairStatus.COMPLETED || data.status === RepairStatus.CANCELLED) &&
      (existing.status === RepairStatus.PENDING || existing.status === RepairStatus.IN_PROGRESS)
    ) {
      // Only revert vehicle status if no other active repairs exist
      const hasOtherActiveRepairs = await this.hasOtherActiveRepairs(existing.vehicleId, id);
      if (!hasOtherActiveRepairs) {
        await VehicleModel.update(existing.vehicleId, { status: VehicleStatus.AVAILABLE });
      }
    }

    return super.update(id, data);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const repair = await this.getById(id);

    // If repair was active, check if vehicle should be available
    if (repair.status === RepairStatus.PENDING || repair.status === RepairStatus.IN_PROGRESS) {
      // Only revert vehicle status if no other active repairs exist
      const hasOtherActiveRepairs = await this.hasOtherActiveRepairs(repair.vehicleId, id);
      if (!hasOtherActiveRepairs) {
        await VehicleModel.update(repair.vehicleId, { status: VehicleStatus.AVAILABLE });
      }
    }

    await super.delete(id);
    return { success: true };
  }
}

export const repairsService = new RepairsService();
