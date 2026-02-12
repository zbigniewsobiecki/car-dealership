import { CustomerModel } from '../models/Customer.model.js';
import { SaleModel } from '../models/Sale.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';

export const customersService = {
  async getAll() {
    return CustomerModel.findAll();
  },

  async getById(id: string) {
    const customer = await CustomerModel.findById(id);
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }
    return customer;
  },

  async create(data: CreateCustomerDto, createdBy: string) {
    return CustomerModel.create(data as unknown as Record<string, unknown>, createdBy);
  },

  async update(id: string, data: UpdateCustomerDto) {
    const updated = await CustomerModel.update(id, data);
    if (!updated) {
      throw new AppError(404, 'Customer not found');
    }
    return updated;
  },

  async delete(id: string, hardDelete = false) {
    const deleted = hardDelete 
      ? await CustomerModel.hardDelete(id)
      : await CustomerModel.delete(id);
      
    if (!deleted) {
      throw new AppError(404, 'Customer not found');
    }
    return { success: true };
  },

  async getSales(id: string) {
    // Check if customer exists
    const customer = await CustomerModel.findById(id);
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }

    return SaleModel.findByCustomerId(id);
  },
};
