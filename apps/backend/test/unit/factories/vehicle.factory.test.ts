import { describe, it, expect } from 'vitest';
import { 
  createMockMotorcycle, 
  createMockCreateMotorcycleDto, 
  createMockVehicle 
} from '../../factories/vehicle.factory';
import { VehicleType } from '@car-dealership/shared-types';

describe('Vehicle Factory', () => {
  describe('createMockVehicle', () => {
    it('should include engineDisplacement and category as undefined by default', () => {
      const vehicle = createMockVehicle();
      expect(vehicle).toHaveProperty('engineDisplacement', undefined);
      expect(vehicle).toHaveProperty('category', undefined);
    });

    it('should allow overriding engineDisplacement and category', () => {
      const vehicle = createMockVehicle({
        engineDisplacement: 1500,
        category: 'Cruiser'
      });
      expect(vehicle.engineDisplacement).toBe(1500);
      expect(vehicle.category).toBe('Cruiser');
    });
  });

  describe('createMockMotorcycle', () => {
    it('should create a motorcycle with default bike values', () => {
      const bike = createMockMotorcycle();
      expect(bike.type).toBe(VehicleType.MOTORCYCLE);
      expect(bike.make).toBe('Yamaha');
      expect(bike.model).toBe('MT-07');
      expect(bike.engineDisplacement).toBe(689);
      expect(bike.category).toBe('Naked');
    });

    it('should allow overrides for motorcycle', () => {
      const bike = createMockMotorcycle({ make: 'Ducati', model: 'Monster' });
      expect(bike.make).toBe('Ducati');
      expect(bike.model).toBe('Monster');
      expect(bike.type).toBe(VehicleType.MOTORCYCLE);
    });
  });

  describe('createMockCreateMotorcycleDto', () => {
    it('should create a motorcycle DTO with default bike values', () => {
      const dto = createMockCreateMotorcycleDto();
      expect(dto.type).toBe(VehicleType.MOTORCYCLE);
      expect(dto.make).toBe('Kawasaki');
      expect(dto.engineDisplacement).toBe(399);
      expect(dto.category).toBe('Sport');
    });
  });
});