import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleStatus } from '@car-dealership/shared-types';
import {
  createMockVehicle,
  createMockCreateVehicleDto,
  createMockUpdateVehicleDto,
} from '../../factories/vehicle.factory';

// Mock VehicleModel
const mockVehicleModel = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByVin: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getStats: vi.fn(),
};
vi.mock('../../../src/models/Vehicle.model.js', () => ({
  VehicleModel: mockVehicleModel,
}));

// Import after mocking
const { vehiclesService } = await import('../../../src/services/vehicles.service.js');
const { AppError } = await import('../../../src/middleware/errorHandler.middleware.js');

describe('vehiclesService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all vehicles', async () => {
      const vehicles = [createMockVehicle(), createMockVehicle()];
      mockVehicleModel.findAll.mockResolvedValue({ vehicles, total: 2 });

      const result = await vehiclesService.getAll();

      expect(mockVehicleModel.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual({ vehicles, total: 2 });
    });

    it('should pass filters to model', async () => {
      const filters = { make: 'Toyota', status: VehicleStatus.AVAILABLE };
      const vehicles = [createMockVehicle({ make: 'Toyota' })];
      mockVehicleModel.findAll.mockResolvedValue({ vehicles, total: 1 });

      const result = await vehiclesService.getAll(filters);

      expect(mockVehicleModel.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual({ vehicles, total: 1 });
    });
  });

  describe('getById', () => {
    it('should return vehicle by id', async () => {
      const vehicle = createMockVehicle();
      mockVehicleModel.findById.mockResolvedValue(vehicle);

      const result = await vehiclesService.getById(vehicle.id);

      expect(mockVehicleModel.findById).toHaveBeenCalledWith(vehicle.id);
      expect(result).toEqual(vehicle);
    });

    it('should throw error if vehicle not found', async () => {
      mockVehicleModel.findById.mockResolvedValue(null);

      await expect(vehiclesService.getById('nonexistent-id')).rejects.toThrow(AppError);
      await expect(vehiclesService.getById('nonexistent-id')).rejects.toThrow(
        'Vehicle not found'
      );
    });
  });

  describe('create', () => {
    it('should create a vehicle successfully', async () => {
      const createDto = createMockCreateVehicleDto();
      const createdVehicle = createMockVehicle({ ...createDto });

      mockVehicleModel.findByVin.mockResolvedValue(null);
      mockVehicleModel.create.mockResolvedValue(createdVehicle);

      const result = await vehiclesService.create(createDto, 'user-id');

      expect(mockVehicleModel.findByVin).toHaveBeenCalledWith(createDto.vin);
      expect(mockVehicleModel.create).toHaveBeenCalledWith(createDto, 'user-id');
      expect(result).toEqual(createdVehicle);
    });

    it('should throw error if VIN already exists', async () => {
      const createDto = createMockCreateVehicleDto();
      const existingVehicle = createMockVehicle({ vin: createDto.vin });

      mockVehicleModel.findByVin.mockResolvedValue(existingVehicle);

      await expect(vehiclesService.create(createDto, 'user-id')).rejects.toThrow(
        'Vehicle with this VIN already exists'
      );
    });
  });

  describe('update', () => {
    it('should update a vehicle successfully', async () => {
      const existingVehicle = createMockVehicle();
      const updateDto = createMockUpdateVehicleDto();
      const updatedVehicle = { ...existingVehicle, ...updateDto };

      mockVehicleModel.findById.mockResolvedValue(existingVehicle);
      mockVehicleModel.update.mockResolvedValue(updatedVehicle);

      const result = await vehiclesService.update(existingVehicle.id, updateDto);

      expect(mockVehicleModel.findById).toHaveBeenCalledWith(existingVehicle.id);
      expect(mockVehicleModel.update).toHaveBeenCalledWith(existingVehicle.id, updateDto);
      expect(result).toEqual(updatedVehicle);
    });

    it('should throw error if vehicle not found', async () => {
      mockVehicleModel.findById.mockResolvedValue(null);

      await expect(
        vehiclesService.update('nonexistent-id', createMockUpdateVehicleDto())
      ).rejects.toThrow('Vehicle not found');
    });

    it('should throw error if updating to existing VIN', async () => {
      const existingVehicle = createMockVehicle({ vin: 'ORIGINAL_VIN' });
      const otherVehicle = createMockVehicle({ vin: 'OTHER_VIN' });
      const updateDto = { vin: 'OTHER_VIN' };

      mockVehicleModel.findById.mockResolvedValue(existingVehicle);
      mockVehicleModel.findByVin.mockResolvedValue(otherVehicle);

      await expect(
        vehiclesService.update(existingVehicle.id, updateDto)
      ).rejects.toThrow('Vehicle with this VIN already exists');
    });

    it('should allow updating to same VIN', async () => {
      const existingVehicle = createMockVehicle({ vin: 'SAME_VIN' });
      const updateDto = { vin: 'SAME_VIN', price: 30000 };
      const updatedVehicle = { ...existingVehicle, price: 30000 };

      mockVehicleModel.findById.mockResolvedValue(existingVehicle);
      mockVehicleModel.update.mockResolvedValue(updatedVehicle);

      const result = await vehiclesService.update(existingVehicle.id, updateDto);

      expect(mockVehicleModel.findByVin).not.toHaveBeenCalled();
      expect(result).toEqual(updatedVehicle);
    });

    it('should throw error if update returns null', async () => {
      const existingVehicle = createMockVehicle();
      const updateDto = createMockUpdateVehicleDto();

      mockVehicleModel.findById.mockResolvedValue(existingVehicle);
      mockVehicleModel.update.mockResolvedValue(null);

      await expect(
        vehiclesService.update(existingVehicle.id, updateDto)
      ).rejects.toThrow('Vehicle not found');
    });
  });

  describe('delete', () => {
    it('should delete a vehicle successfully', async () => {
      mockVehicleModel.delete.mockResolvedValue(true);

      const result = await vehiclesService.delete('vehicle-id');

      expect(mockVehicleModel.delete).toHaveBeenCalledWith('vehicle-id');
      expect(result).toEqual({ success: true });
    });

    it('should throw error if vehicle not found', async () => {
      mockVehicleModel.delete.mockResolvedValue(false);

      await expect(vehiclesService.delete('nonexistent-id')).rejects.toThrow(
        'Vehicle not found'
      );
    });
  });

  describe('getStats', () => {
    it('should return vehicle stats', async () => {
      const stats = {
        total: 10,
        available: 5,
        sold: 3,
        reserved: 1,
        maintenance: 1,
        totalInventoryValue: 250000,
      };
      mockVehicleModel.getStats.mockResolvedValue(stats);

      const result = await vehiclesService.getStats();

      expect(mockVehicleModel.getStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });
});
