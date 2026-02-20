import { describe, it, expect, beforeEach, vi } from 'vitest';
import { customersService } from '../../../src/services/customers.service';
import api from '../../../src/services/api';
import { CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';

vi.mock('../../../src/services/api');

describe('customersService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ id: '1', firstName: 'John' }];
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockCustomers } });

      const result = await customersService.getAll();

      expect(api.get).toHaveBeenCalledWith('/customers');
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('getById', () => {
    it('should return a customer by id', async () => {
      const mockCustomer = { id: '1', firstName: 'John' };
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockCustomer } });

      const result = await customersService.getById('1');

      expect(api.get).toHaveBeenCalledWith('/customers/1');
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const newCustomer = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: '555-1234' };
      const mockResponse = { id: '2', ...newCustomer };
      vi.mocked(api.post).mockResolvedValue({ data: { data: mockResponse } });

      const result = await customersService.create(newCustomer as CreateCustomerDto);

      expect(api.post).toHaveBeenCalledWith('/customers', newCustomer);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateData = { firstName: 'Johnny' };
      const mockResponse = { id: '1', firstName: 'Johnny' };
      vi.mocked(api.put).mockResolvedValue({ data: { data: mockResponse } });

      const result = await customersService.update('1', updateData as UpdateCustomerDto);

      expect(api.put).toHaveBeenCalledWith('/customers/1', updateData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete a customer', async () => {
      vi.mocked(api.delete).mockResolvedValue({});

      await customersService.delete('1');

      expect(api.delete).toHaveBeenCalledWith('/customers/1');
    });
  });

  describe('getSales', () => {
    it('should return customer sales', async () => {
      const mockSales = [{ id: 'sale-1' }];
      vi.mocked(api.get).mockResolvedValue({ data: { data: mockSales } });

      const result = await customersService.getSales('1');

      expect(api.get).toHaveBeenCalledWith('/customers/1/sales');
      expect(result).toEqual(mockSales);
    });
  });
});