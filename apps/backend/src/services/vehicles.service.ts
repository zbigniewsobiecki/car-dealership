import { VehicleModel } from '../models/Vehicle.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
  VehicleStats,
} from '@car-dealership/shared-types';

export const vehiclesService = {
  async getRecent(days: number) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    return VehicleModel.findRecent(fromDate);
  },

  async getAll(filters?: VehicleFilters) {
    return VehicleModel.findAll(filters);
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

    return VehicleModel.create(data, createdBy);
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
};
