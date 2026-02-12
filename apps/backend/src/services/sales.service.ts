import { SaleModel } from '../models/Sale.model.js';
import { VehicleModel } from '../models/Vehicle.model.js';
import { CustomerModel } from '../models/Customer.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { CreateSaleDto, UpdateSaleDto, VehicleStatus, SaleStatus } from '@car-dealership/shared-types';

export const salesService = {
  async getAll() {
    return SaleModel.findAll();
  },

  async getById(id: string) {
    const sale = await SaleModel.findById(id);
    if (!sale) {
      throw new AppError(404, 'Sale not found');
    }
    return sale;
  },

  async create(data: CreateSaleDto) {
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

    // Create sale
    const sale = await SaleModel.create(data);

    // Update vehicle status if sale is completed
    if (data.status === SaleStatus.COMPLETED) {
      await VehicleModel.update(data.vehicleId, { status: VehicleStatus.SOLD });
    }

    return sale;
  },

  async update(id: string, data: UpdateSaleDto) {
    const existing = await SaleModel.findById(id);
    if (!existing) {
      throw new AppError(404, 'Sale not found');
    }

    // If status is being changed to completed, update vehicle status
    if (data.status === SaleStatus.COMPLETED && existing.status !== SaleStatus.COMPLETED) {
      await VehicleModel.update(existing.vehicleId, { status: VehicleStatus.SOLD });
    }

    // If status is being changed from completed to something else, revert vehicle status
    if (data.status && data.status !== SaleStatus.COMPLETED && existing.status === SaleStatus.COMPLETED) {
      await VehicleModel.update(existing.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    const updated = await SaleModel.update(id, data);
    if (!updated) {
      throw new AppError(404, 'Sale not found');
    }

    return updated;
  },

  async delete(id: string) {
    const sale = await SaleModel.findById(id);
    if (!sale) {
      throw new AppError(404, 'Sale not found');
    }

    // If sale was completed, revert vehicle status
    if (sale.status === SaleStatus.COMPLETED) {
      await VehicleModel.update(sale.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    const deleted = await SaleModel.delete(id);
    if (!deleted) {
      throw new AppError(404, 'Sale not found');
    }

    return { success: true };
  },

  async getStats() {
    return SaleModel.getStats();
  },

  async getMonthlyStats() {
    return SaleModel.getMonthlyStats();
  },

  async getRevenueReport(from?: string, to?: string) {
    const startDate = from ? new Date(from) : new Date(0);
    const endDate = to ? new Date(to) : new Date();

    if (isNaN(startDate.getTime())) {
      throw new AppError(400, 'Invalid start date format');
    }
    if (isNaN(endDate.getTime())) {
      throw new AppError(400, 'Invalid end date format');
    }

    return SaleModel.getRevenueReport(startDate, endDate);
  },
};
