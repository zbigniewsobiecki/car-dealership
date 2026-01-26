import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMockCustomer,
  createMockCreateCustomerDto,
  createMockUpdateCustomerDto,
} from '../../factories/customer.factory';
import { createMockSale } from '../../factories/sale.factory';

// Mock CustomerModel
const mockCustomerModel = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
vi.mock('../../../src/models/Customer.model.js', () => ({
  CustomerModel: mockCustomerModel,
}));

// Mock SaleModel
const mockSaleModel = {
  findByCustomerId: vi.fn(),
};
vi.mock('../../../src/models/Sale.model.js', () => ({
  SaleModel: mockSaleModel,
}));

// Import after mocking
const { customersService } = await import('../../../src/services/customers.service.js');
const { AppError } = await import('../../../src/middleware/errorHandler.middleware.js');

describe('customersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all customers', async () => {
      const customers = [createMockCustomer(), createMockCustomer()];
      mockCustomerModel.findAll.mockResolvedValue(customers);

      const result = await customersService.getAll();

      expect(mockCustomerModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(customers);
    });
  });

  describe('getById', () => {
    it('should return customer by id', async () => {
      const customer = createMockCustomer();
      mockCustomerModel.findById.mockResolvedValue(customer);

      const result = await customersService.getById(customer.id);

      expect(mockCustomerModel.findById).toHaveBeenCalledWith(customer.id);
      expect(result).toEqual(customer);
    });

    it('should throw error if customer not found', async () => {
      mockCustomerModel.findById.mockResolvedValue(null);

      await expect(customersService.getById('nonexistent-id')).rejects.toThrow(AppError);
      await expect(customersService.getById('nonexistent-id')).rejects.toThrow(
        'Customer not found'
      );
    });
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const createDto = createMockCreateCustomerDto();
      const createdCustomer = createMockCustomer({ ...createDto });

      mockCustomerModel.create.mockResolvedValue(createdCustomer);

      const result = await customersService.create(createDto, 'user-id');

      expect(mockCustomerModel.create).toHaveBeenCalledWith(createDto, 'user-id');
      expect(result).toEqual(createdCustomer);
    });
  });

  describe('update', () => {
    it('should update a customer successfully', async () => {
      const existingCustomer = createMockCustomer();
      const updateDto = createMockUpdateCustomerDto();
      const updatedCustomer = { ...existingCustomer, ...updateDto };

      mockCustomerModel.update.mockResolvedValue(updatedCustomer);

      const result = await customersService.update(existingCustomer.id, updateDto);

      expect(mockCustomerModel.update).toHaveBeenCalledWith(existingCustomer.id, updateDto);
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw error if customer not found', async () => {
      mockCustomerModel.update.mockResolvedValue(null);

      await expect(
        customersService.update('nonexistent-id', createMockUpdateCustomerDto())
      ).rejects.toThrow('Customer not found');
    });
  });

  describe('delete', () => {
    it('should delete a customer successfully', async () => {
      mockCustomerModel.delete.mockResolvedValue(true);

      const result = await customersService.delete('customer-id');

      expect(mockCustomerModel.delete).toHaveBeenCalledWith('customer-id');
      expect(result).toEqual({ success: true });
    });

    it('should throw error if customer not found', async () => {
      mockCustomerModel.delete.mockResolvedValue(false);

      await expect(customersService.delete('nonexistent-id')).rejects.toThrow(
        'Customer not found'
      );
    });
  });

  describe('getSales', () => {
    it('should return sales for a customer', async () => {
      const customer = createMockCustomer();
      const sales = [
        createMockSale({ customerId: customer.id }),
        createMockSale({ customerId: customer.id }),
      ];

      mockCustomerModel.findById.mockResolvedValue(customer);
      mockSaleModel.findByCustomerId.mockResolvedValue(sales);

      const result = await customersService.getSales(customer.id);

      expect(mockCustomerModel.findById).toHaveBeenCalledWith(customer.id);
      expect(mockSaleModel.findByCustomerId).toHaveBeenCalledWith(customer.id);
      expect(result).toEqual(sales);
    });

    it('should throw error if customer not found', async () => {
      mockCustomerModel.findById.mockResolvedValue(null);

      await expect(customersService.getSales('nonexistent-id')).rejects.toThrow(
        'Customer not found'
      );
    });
  });
});
