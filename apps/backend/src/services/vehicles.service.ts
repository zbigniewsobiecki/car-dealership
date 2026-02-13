import { VehicleModel } from '../models/Vehicle.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleStats,
} from '@car-dealership/shared-types';
import { BaseService } from './BaseService.js';

class VehiclesService extends BaseService<Vehicle, CreateVehicleDto, UpdateVehicleDto, Record<string, unknown>> {
  constructor() {
    super(VehicleModel, 'Vehicle');
  }

  async create(data: CreateVehicleDto, createdBy: string) {
    // Check if VIN already exists
    const existing = await VehicleModel.findByVin(data.vin);
    if (existing) {
      throw new AppError(400, 'Vehicle with this VIN already exists');
    }

    return super.create(data, createdBy);
  }

  async update(id: string, data: UpdateVehicleDto) {
    // Check if vehicle exists
    const existing = await this.getById(id);

    // If VIN is being updated, check it doesn't conflict
    if (data.vin && data.vin !== existing.vin) {
      const vinExists = await VehicleModel.findByVin(data.vin);
      if (vinExists) {
        throw new AppError(400, 'Vehicle with this VIN already exists');
      }
    }

    return super.update(id, data);
  }

  async delete(id: string) {
    await super.delete(id);
    return { success: true };
  }

  async getStats(): Promise<VehicleStats> {
    return VehicleModel.getStats();
  }

  async getRecent(limit: number) {
    return VehicleModel.findRecent(limit);
  }
}

export const vehiclesService = new VehiclesService();