import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaleStatus, VehicleStatus } from '@car-dealership/shared-types';
import {
  createMockSale,
  createMockCreateSaleDto,
  createMockUpdateSaleDto,
} from '../../factories/sale.factory';
import { createMockVehicle } from '../../factories/vehicle.factory';
import { createMockCustomer } from '../../factories/customer.factory';

// Mock models
const mockSaleModel = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStats: vi.fn(),
  getMonthlyStats: vi.fn(),
};
vi.mock('../../../src/models/Sale.model.js', () => ({
  SaleModel: mockSaleModel,
}));

const mockVehicleModel = {
  findById: vi.fn(),
  update: vi.fn(),
};
vi.mock('../../../src/models/Vehicle.model.js', () => ({
  VehicleModel: mockVehicleModel,
}));

const mockCustomerModel = {
  findById: vi.fn(),
};
vi.mock('../../../src/models/Customer.model.js', () => ({
  CustomerModel: mockCustomerModel,
}));

// Import after mocking
const { salesService } = await import('../../../src/services/sales.service.js');
const { AppError } = await import('../../../src/middleware/errorHandler.middleware.js');

describe('salesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all sales', async () => {
      const sales = [createMockSale(), createMockSale()];
      mockSaleModel.findAll.mockResolvedValue(sales);

      const result = await salesService.getAll();

      expect(mockSaleModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(sales);
    });
  });

  describe('getById', () => {
    it('should return sale by id', async () => {
      const sale = createMockSale();
      mockSaleModel.findById.mockResolvedValue(sale);

      const result = await salesService.getById(sale.id);

      expect(mockSaleModel.findById).toHaveBeenCalledWith(sale.id);
      expect(result).toEqual(sale);
    });

    it('should throw error if sale not found', async () => {
      mockSaleModel.findById.mockResolvedValue(null);

      await expect(salesService.getById('nonexistent-id')).rejects.toThrow(AppError);
      await expect(salesService.getById('nonexistent-id')).rejects.toThrow(
        'Sale not found'
      );
    });
  });

  describe('create', () => {
    it('should create a sale successfully', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateSaleDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: SaleStatus.PENDING,
      });
      const createdSale = createMockSale({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockSaleModel.create.mockResolvedValue(createdSale);

      const result = await salesService.create(createDto);

      expect(mockVehicleModel.findById).toHaveBeenCalledWith(createDto.vehicleId);
      expect(mockCustomerModel.findById).toHaveBeenCalledWith(createDto.customerId);
      expect(mockSaleModel.create).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(createdSale);
    });

    it('should throw error if vehicle not found', async () => {
      const createDto = createMockCreateSaleDto();
      mockVehicleModel.findById.mockResolvedValue(null);

      await expect(salesService.create(createDto)).rejects.toThrow('Vehicle not found');
    });

    it('should throw error if customer not found', async () => {
      const vehicle = createMockVehicle();
      const createDto = createMockCreateSaleDto({ vehicleId: vehicle.id });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(null);

      await expect(salesService.create(createDto)).rejects.toThrow('Customer not found');
    });

    it('should update vehicle status to SOLD when sale is completed', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateSaleDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: SaleStatus.COMPLETED,
      });
      const createdSale = createMockSale({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockSaleModel.create.mockResolvedValue(createdSale);

      await salesService.create(createDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(vehicle.id, {
        status: VehicleStatus.SOLD,
      });
    });

    it('should not update vehicle status when sale is pending', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateSaleDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: SaleStatus.PENDING,
      });
      const createdSale = createMockSale({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockSaleModel.create.mockResolvedValue(createdSale);

      await salesService.create(createDto);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a sale successfully', async () => {
      const existingSale = createMockSale({ status: SaleStatus.PENDING });
      const updateDto = createMockUpdateSaleDto({ status: SaleStatus.PENDING });
      const updatedSale = { ...existingSale, ...updateDto };

      mockSaleModel.findById.mockResolvedValue(existingSale);
      mockSaleModel.update.mockResolvedValue(updatedSale);

      const result = await salesService.update(existingSale.id, updateDto);

      expect(mockSaleModel.findById).toHaveBeenCalledWith(existingSale.id);
      expect(mockSaleModel.update).toHaveBeenCalledWith(existingSale.id, updateDto);
      expect(result).toEqual(updatedSale);
    });

    it('should throw error if sale not found', async () => {
      mockSaleModel.findById.mockResolvedValue(null);

      await expect(
        salesService.update('nonexistent-id', createMockUpdateSaleDto())
      ).rejects.toThrow('Sale not found');
    });

    it('should update vehicle to SOLD when status changes to completed', async () => {
      const existingSale = createMockSale({ status: SaleStatus.PENDING });
      const updateDto = { status: SaleStatus.COMPLETED };
      const updatedSale = { ...existingSale, ...updateDto };

      mockSaleModel.findById.mockResolvedValue(existingSale);
      mockSaleModel.update.mockResolvedValue(updatedSale);

      await salesService.update(existingSale.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingSale.vehicleId, {
        status: VehicleStatus.SOLD,
      });
    });

    it('should revert vehicle to AVAILABLE when status changes from completed', async () => {
      const existingSale = createMockSale({ status: SaleStatus.COMPLETED });
      const updateDto = { status: SaleStatus.CANCELLED };
      const updatedSale = { ...existingSale, ...updateDto };

      mockSaleModel.findById.mockResolvedValue(existingSale);
      mockSaleModel.update.mockResolvedValue(updatedSale);

      await salesService.update(existingSale.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingSale.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should throw error if update returns null', async () => {
      const existingSale = createMockSale();
      mockSaleModel.findById.mockResolvedValue(existingSale);
      mockSaleModel.update.mockResolvedValue(null);

      await expect(
        salesService.update(existingSale.id, createMockUpdateSaleDto())
      ).rejects.toThrow('Sale not found');
    });
  });

  describe('delete', () => {
    it('should delete a sale successfully', async () => {
      const sale = createMockSale({ status: SaleStatus.PENDING });
      mockSaleModel.findById.mockResolvedValue(sale);
      mockSaleModel.delete.mockResolvedValue(true);

      const result = await salesService.delete(sale.id);

      expect(mockSaleModel.findById).toHaveBeenCalledWith(sale.id);
      expect(mockSaleModel.delete).toHaveBeenCalledWith(sale.id);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if sale not found on initial lookup', async () => {
      mockSaleModel.findById.mockResolvedValue(null);

      await expect(salesService.delete('nonexistent-id')).rejects.toThrow(
        'Sale not found'
      );
    });

    it('should revert vehicle status when deleting completed sale', async () => {
      const sale = createMockSale({ status: SaleStatus.COMPLETED });
      mockSaleModel.findById.mockResolvedValue(sale);
      mockSaleModel.delete.mockResolvedValue(true);

      await salesService.delete(sale.id);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(sale.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should not change vehicle status when deleting pending sale', async () => {
      const sale = createMockSale({ status: SaleStatus.PENDING });
      mockSaleModel.findById.mockResolvedValue(sale);
      mockSaleModel.delete.mockResolvedValue(true);

      await salesService.delete(sale.id);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });

    it('should throw error if delete returns false', async () => {
      const sale = createMockSale();
      mockSaleModel.findById.mockResolvedValue(sale);
      mockSaleModel.delete.mockResolvedValue(false);

      await expect(salesService.delete(sale.id)).rejects.toThrow('Sale not found');
    });
  });

  describe('getStats', () => {
    it('should return sale stats', async () => {
      const stats = {
        total_sales: 10,
        completed_sales: 6,
        pending_sales: 3,
        total_revenue: 200000,
        average_sale_price: 33333.33,
      };
      mockSaleModel.getStats.mockResolvedValue(stats);

      const result = await salesService.getStats();

      expect(mockSaleModel.getStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('getMonthlyStats', () => {
    it('should return monthly stats', async () => {
      const monthlyStats = [
        { month: '2024-01', sales_count: 5, revenue: 100000 },
        { month: '2024-02', sales_count: 5, revenue: 100000 },
      ];
      mockSaleModel.getMonthlyStats.mockResolvedValue(monthlyStats);

      const result = await salesService.getMonthlyStats();

      expect(mockSaleModel.getMonthlyStats).toHaveBeenCalled();
      expect(result).toEqual(monthlyStats);
    });
  });
});
