import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepairStatus, VehicleStatus } from '@car-dealership/shared-types';
import {
  createMockRepair,
  createMockCreateRepairDto,
  createMockUpdateRepairDto,
} from '../../factories/repair.factory';
import { createMockVehicle } from '../../factories/vehicle.factory';
import { createMockCustomer } from '../../factories/customer.factory';

// Mock models
const mockRepairModel = {
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};
vi.mock('../../../src/models/Repair.model.js', () => ({
  RepairModel: mockRepairModel,
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
const { repairsService } = await import('../../../src/services/repairs.service.js');
const { AppError } = await import('../../../src/middleware/errorHandler.middleware.js');

describe('repairsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all repairs', async () => {
      const repairs = [createMockRepair(), createMockRepair()];
      mockRepairModel.findAll.mockResolvedValue(repairs);

      const result = await repairsService.getAll({});

      expect(mockRepairModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(repairs);
    });
  });

  describe('getById', () => {
    it('should return repair by id', async () => {
      const repair = createMockRepair();
      mockRepairModel.findById.mockResolvedValue(repair);

      const result = await repairsService.getById(repair.id);

      expect(mockRepairModel.findById).toHaveBeenCalledWith(repair.id);
      expect(result).toEqual(repair);
    });

    it('should throw error if repair not found', async () => {
      mockRepairModel.findById.mockResolvedValue(null);

      await expect(repairsService.getById('nonexistent-id')).rejects.toThrow(AppError);
      await expect(repairsService.getById('nonexistent-id')).rejects.toThrow(
        'Repair not found'
      );
    });
  });

  describe('create', () => {
    it('should create a repair successfully', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateRepairDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: RepairStatus.PENDING,
      });
      const createdRepair = createMockRepair({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockRepairModel.create.mockResolvedValue(createdRepair);

      const result = await repairsService.create(createDto);

      expect(mockVehicleModel.findById).toHaveBeenCalledWith(createDto.vehicleId);
      expect(mockCustomerModel.findById).toHaveBeenCalledWith(createDto.customerId);
      expect(mockRepairModel.create).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(createdRepair);
    });

    it('should throw error if vehicle not found', async () => {
      const createDto = createMockCreateRepairDto();
      mockVehicleModel.findById.mockResolvedValue(null);

      await expect(repairsService.create(createDto)).rejects.toThrow('Vehicle not found');
    });

    it('should throw error if customer not found', async () => {
      const vehicle = createMockVehicle();
      const createDto = createMockCreateRepairDto({ vehicleId: vehicle.id });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(null);

      await expect(repairsService.create(createDto)).rejects.toThrow('Customer not found');
    });

    it('should update vehicle status to MAINTENANCE when repair is PENDING', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateRepairDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: RepairStatus.PENDING,
      });
      const createdRepair = createMockRepair({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockRepairModel.create.mockResolvedValue(createdRepair);

      await repairsService.create(createDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(vehicle.id, {
        status: VehicleStatus.MAINTENANCE,
      });
    });

    it('should update vehicle status to MAINTENANCE when repair is IN_PROGRESS', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateRepairDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: RepairStatus.IN_PROGRESS,
      });
      const createdRepair = createMockRepair({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockRepairModel.create.mockResolvedValue(createdRepair);

      await repairsService.create(createDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(vehicle.id, {
        status: VehicleStatus.MAINTENANCE,
      });
    });

    it('should not update vehicle status when repair is COMPLETED', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateRepairDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: RepairStatus.COMPLETED,
      });
      const createdRepair = createMockRepair({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockRepairModel.create.mockResolvedValue(createdRepair);

      await repairsService.create(createDto);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });

    it('should not update vehicle status when repair is CANCELLED', async () => {
      const vehicle = createMockVehicle();
      const customer = createMockCustomer();
      const createDto = createMockCreateRepairDto({
        vehicleId: vehicle.id,
        customerId: customer.id,
        status: RepairStatus.CANCELLED,
      });
      const createdRepair = createMockRepair({ ...createDto });

      mockVehicleModel.findById.mockResolvedValue(vehicle);
      mockCustomerModel.findById.mockResolvedValue(customer);
      mockRepairModel.create.mockResolvedValue(createdRepair);

      await repairsService.create(createDto);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a repair successfully', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.PENDING });
      const updateDto = createMockUpdateRepairDto({ cost: 600 });
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      const result = await repairsService.update(existingRepair.id, updateDto);

      expect(mockRepairModel.findById).toHaveBeenCalledWith(existingRepair.id);
      expect(mockRepairModel.update).toHaveBeenCalledWith(existingRepair.id, updateDto);
      expect(result).toEqual(updatedRepair);
    });

    it('should throw error if repair not found', async () => {
      mockRepairModel.findById.mockResolvedValue(null);

      await expect(
        repairsService.update('nonexistent-id', createMockUpdateRepairDto())
      ).rejects.toThrow('Repair not found');
    });

    it('should update vehicle to MAINTENANCE when status changes to IN_PROGRESS', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.PENDING });
      const updateDto = { status: RepairStatus.IN_PROGRESS };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingRepair.vehicleId, {
        status: VehicleStatus.MAINTENANCE,
      });
    });

    it('should not update vehicle status when already IN_PROGRESS', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.IN_PROGRESS });
      const updateDto = { status: RepairStatus.IN_PROGRESS };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });

    it('should revert vehicle to AVAILABLE when status changes from PENDING to COMPLETED', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.PENDING });
      const updateDto = { status: RepairStatus.COMPLETED };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingRepair.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should revert vehicle to AVAILABLE when status changes from IN_PROGRESS to COMPLETED', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.IN_PROGRESS });
      const updateDto = { status: RepairStatus.COMPLETED };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingRepair.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should revert vehicle to AVAILABLE when status changes from PENDING to CANCELLED', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.PENDING });
      const updateDto = { status: RepairStatus.CANCELLED };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingRepair.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should revert vehicle to AVAILABLE when status changes from IN_PROGRESS to CANCELLED', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.IN_PROGRESS });
      const updateDto = { status: RepairStatus.CANCELLED };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingRepair.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should not change vehicle status when already COMPLETED', async () => {
      const existingRepair = createMockRepair({ status: RepairStatus.COMPLETED });
      const updateDto = { cost: 700 };
      const updatedRepair = { ...existingRepair, ...updateDto };

      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(updatedRepair);

      await repairsService.update(existingRepair.id, updateDto);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });

    it('should throw error if update returns null', async () => {
      const existingRepair = createMockRepair();
      mockRepairModel.findById.mockResolvedValue(existingRepair);
      mockRepairModel.update.mockResolvedValue(null);

      await expect(
        repairsService.update(existingRepair.id, createMockUpdateRepairDto())
      ).rejects.toThrow('Repair not found');
    });
  });

  describe('delete', () => {
    it('should delete a repair successfully', async () => {
      const repair = createMockRepair({ status: RepairStatus.COMPLETED });
      mockRepairModel.findById.mockResolvedValue(repair);
      mockRepairModel.delete.mockResolvedValue(true);

      const result = await repairsService.delete(repair.id);

      expect(mockRepairModel.findById).toHaveBeenCalledWith(repair.id);
      expect(mockRepairModel.delete).toHaveBeenCalledWith(repair.id);
      expect(result).toEqual({ success: true });
    });

    it('should throw error if repair not found on initial lookup', async () => {
      mockRepairModel.findById.mockResolvedValue(null);

      await expect(repairsService.delete('nonexistent-id')).rejects.toThrow(
        'Repair not found'
      );
    });

    it('should revert vehicle status when deleting PENDING repair', async () => {
      const repair = createMockRepair({ status: RepairStatus.PENDING });
      mockRepairModel.findById.mockResolvedValue(repair);
      mockRepairModel.delete.mockResolvedValue(true);

      await repairsService.delete(repair.id);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(repair.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should revert vehicle status when deleting IN_PROGRESS repair', async () => {
      const repair = createMockRepair({ status: RepairStatus.IN_PROGRESS });
      mockRepairModel.findById.mockResolvedValue(repair);
      mockRepairModel.delete.mockResolvedValue(true);

      await repairsService.delete(repair.id);

      expect(mockVehicleModel.update).toHaveBeenCalledWith(repair.vehicleId, {
        status: VehicleStatus.AVAILABLE,
      });
    });

    it('should not change vehicle status when deleting COMPLETED repair', async () => {
      const repair = createMockRepair({ status: RepairStatus.COMPLETED });
      mockRepairModel.findById.mockResolvedValue(repair);
      mockRepairModel.delete.mockResolvedValue(true);

      await repairsService.delete(repair.id);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });

    it('should not change vehicle status when deleting CANCELLED repair', async () => {
      const repair = createMockRepair({ status: RepairStatus.CANCELLED });
      mockRepairModel.findById.mockResolvedValue(repair);
      mockRepairModel.delete.mockResolvedValue(true);

      await repairsService.delete(repair.id);

      expect(mockVehicleModel.update).not.toHaveBeenCalled();
    });

    it('should throw error if delete returns false', async () => {
      const repair = createMockRepair();
      mockRepairModel.findById.mockResolvedValue(repair);
      mockRepairModel.delete.mockResolvedValue(false);

      await expect(repairsService.delete(repair.id)).rejects.toThrow('Repair not found');
    });
  });
});
