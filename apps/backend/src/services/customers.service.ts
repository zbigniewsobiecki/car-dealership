import { CustomerModel } from '../models/Customer.model.js';
import { SaleModel } from '../models/Sale.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';
import { BaseService } from './BaseService.js';

class CustomersService extends BaseService<Customer, CreateCustomerDto, UpdateCustomerDto> {
  constructor() {
    super(CustomerModel, 'Customer');
  }

  async delete(id: string, hardDelete = false): Promise<{ success: boolean }> {
    const deleted = hardDelete 
      ? await CustomerModel.hardDelete(id)
      : await this.repository.delete(id);
      
    if (!deleted) {
      throw new AppError(404, 'Customer not found');
    }
    return { success: true };
  }

  async getSales(id: string) {
    // Check if customer exists
    await this.getById(id);
    return SaleModel.findByCustomerId(id);
  }
}

export const customersService = new CustomersService();