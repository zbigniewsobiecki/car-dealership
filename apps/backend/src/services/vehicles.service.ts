import { VehicleModel } from '../models/Vehicle.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
  VehicleStats,
} from '@car-dealership/shared-types';
import { BaseFilters } from '../models/BaseRepository.js';

export const vehiclesService = {
  async getAll(filters?: VehicleFilters) {
    const baseFilters: BaseFilters | undefined = filters ? {
      ...filters,
      sortOrder: filters.sortOrder?.toUpperCase() as 'ASC' | 'DESC' | undefined
    } : undefined;
    return VehicleModel.findAll(baseFilters);
  },

  async getById(id: string) {
    const vehicle = await VehicleModel.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }
    return vehicle;
  },

  async create(data: CreateVehicleDto, createdBy: string) {
    // Check if VIN already exists
    const existing = await VehicleModel.findByVin(data.vin);
    if (existing) {
      throw new AppError(400, 'Vehicle with this VIN already exists');
    }

    return VehicleModel.create(data as unknown as Record<string, unknown>, createdBy);
  },

  async update(id: string, data: UpdateVehicleDto) {
    // Check if vehicle exists
    const existing = await VehicleModel.findById(id);
    if (!existing) {
      throw new AppError(404, 'Vehicle not found');
    }

    // If VIN is being updated, check it doesn't conflict
    if (data.vin && data.vin !== existing.vin) {
      const vinExists = await VehicleModel.findByVin(data.vin);
      if (vinExists) {
        throw new AppError(400, 'Vehicle with this VIN already exists');
      }
    }

    const updated = await VehicleModel.update(id, data);
    if (!updated) {
      throw new AppError(404, 'Vehicle not found');
    }

    return updated;
  },

  async delete(id: string) {
    const deleted = await VehicleModel.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Vehicle not found');
    }
    return { success: true };
  },

  async getStats(): Promise<VehicleStats> {
    return VehicleModel.getStats();
  },

  async getRecent(limit: number) {
    return VehicleModel.findRecent(limit);
  },
};
