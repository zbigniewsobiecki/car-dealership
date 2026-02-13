import { SaleModel } from '../models/Sale.model.js';
import { VehicleModel } from '../models/Vehicle.model.js';
import { CustomerModel } from '../models/Customer.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { Sale, CreateSaleDto, UpdateSaleDto, VehicleStatus, SaleStatus } from '@car-dealership/shared-types';
import { BaseService } from './BaseService.js';

class SalesService extends BaseService<Sale, CreateSaleDto, UpdateSaleDto> {
  constructor() {
    super(SaleModel, 'Sale');
  }

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
    const sale = await super.create(data);

    // Update vehicle status if sale is completed
    if (data.status === SaleStatus.COMPLETED) {
      await VehicleModel.update(data.vehicleId, { status: VehicleStatus.SOLD });
    }

    return sale;
  }

  async update(id: string, data: UpdateSaleDto) {
    const existing = await this.getById(id);

    // If status is being changed to completed, update vehicle status
    if (data.status === SaleStatus.COMPLETED && existing.status !== SaleStatus.COMPLETED) {
      await VehicleModel.update(existing.vehicleId, { status: VehicleStatus.SOLD });
    }

    // If status is being changed from completed to something else, revert vehicle status
    if (data.status && data.status !== SaleStatus.COMPLETED && existing.status === SaleStatus.COMPLETED) {
      await VehicleModel.update(existing.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    return super.update(id, data);
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const sale = await this.getById(id);

    // If sale was completed, revert vehicle status
    if (sale.status === SaleStatus.COMPLETED) {
      await VehicleModel.update(sale.vehicleId, { status: VehicleStatus.AVAILABLE });
    }

    await super.delete(id);
    return { success: true };
  }

  async getStats() {
    return SaleModel.getStats();
  }

  async getMonthlyStats() {
    return SaleModel.getMonthlyStats();
  }

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
  }
}

export const salesService = new SalesService();