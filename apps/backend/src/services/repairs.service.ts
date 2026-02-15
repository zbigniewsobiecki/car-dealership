import { RepairModel } from '../models/Repair.model.js';
import { VehicleModel } from '../models/Vehicle.model.js';
import {
  Repair,
  CreateRepairDto,
  UpdateRepairDto,
  RepairStats,
  RepairStatus,
  VehicleStatus,
} from '@car-dealership/shared-types';
import { BaseService } from './BaseService.js';
import { BaseFilters } from '../models/BaseRepository.js';

class RepairsService extends BaseService<Repair, CreateRepairDto, UpdateRepairDto, BaseFilters> {
  constructor() {
    super(RepairModel, 'Repair');
  }

  async create(data: CreateRepairDto, createdBy: string) {
    // Set default status if not provided
    const repairData = {
      ...data,
      status: data.status || RepairStatus.PENDING,
    };

    const repair = await super.create(repairData, createdBy);

    // If repair is in progress, update vehicle status to maintenance
    if (repairData.status === RepairStatus.IN_PROGRESS) {
      await this.updateVehicleStatus(data.vehicleId, VehicleStatus.MAINTENANCE);
    }

    return repair;
  }

  async update(id: string, data: UpdateRepairDto) {
    const existing = await this.getById(id);

    const updated = await super.update(id, data);

    // Handle status transitions
    if (data.status && data.status !== existing.status) {
      await this.handleStatusTransition(
        updated.vehicleId,
        existing.status,
        data.status
      );
    }

    return updated;
  }

  async delete(id: string) {
    const repair = await this.getById(id);
    await super.delete(id);

    // If the deleted repair was in progress, check if we need to reset vehicle status
    if (repair.status === RepairStatus.IN_PROGRESS) {
      const activeRepairs = await RepairModel.findActive();
      const otherActiveRepairsForVehicle = activeRepairs.filter(
        (r) => r.vehicleId === repair.vehicleId && r.id !== id
      );

      // If no other active repairs for this vehicle, set it back to available
      if (otherActiveRepairsForVehicle.length === 0) {
        await this.updateVehicleStatus(repair.vehicleId, VehicleStatus.AVAILABLE);
      }
    }

    return { success: true };
  }

  async getStats(): Promise<RepairStats> {
    return RepairModel.getStats();
  }

  async getActive(limit: number = 10): Promise<Repair[]> {
    return RepairModel.findActive(limit);
  }

  async getByVehicleId(vehicleId: string): Promise<Repair[]> {
    return RepairModel.findByVehicleId(vehicleId);
  }

  async getByCustomerId(customerId: string): Promise<Repair[]> {
    return RepairModel.findByCustomerId(customerId);
  }

  private async updateVehicleStatus(vehicleId: string, status: VehicleStatus): Promise<void> {
    try {
      await VehicleModel.update(vehicleId, { status });
    } catch (error) {
      // Log but don't fail the repair operation
      console.error(`Failed to update vehicle status: ${error}`);
    }
  }

  private async handleStatusTransition(
    vehicleId: string,
    oldStatus: RepairStatus,
    newStatus: RepairStatus
  ): Promise<void> {
    // When repair starts, set vehicle to maintenance
    if (newStatus === RepairStatus.IN_PROGRESS && oldStatus === RepairStatus.PENDING) {
      await this.updateVehicleStatus(vehicleId, VehicleStatus.MAINTENANCE);
    }

    // When repair is moved back to pending from in progress, set vehicle back to available
    // (assuming no other in-progress repairs, but for simplicity we follow the existing pattern)
    if (newStatus === RepairStatus.PENDING && oldStatus === RepairStatus.IN_PROGRESS) {
      await this.updateVehicleStatus(vehicleId, VehicleStatus.AVAILABLE);
    }

    // When repair completes or is cancelled, set vehicle back to available
    if (
      (newStatus === RepairStatus.COMPLETED || newStatus === RepairStatus.CANCELLED) &&
      (oldStatus === RepairStatus.IN_PROGRESS || oldStatus === RepairStatus.PENDING)
    ) {
      await this.updateVehicleStatus(vehicleId, VehicleStatus.AVAILABLE);
    }
  }
}

export const repairsService = new RepairsService();
