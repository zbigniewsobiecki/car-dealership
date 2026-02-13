import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleStatus,
  VehicleCondition,
  VehicleType,
} from '@car-dealership/shared-types';

let vehicleIdCounter = 1;

export const createMockVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: `vehicle-${vehicleIdCounter++}`,
  vin: `VIN${String(vehicleIdCounter).padStart(14, '0')}`,
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  color: 'Blue',
  mileage: 15000,
  price: 25000,
  cost: 20000,
  type: VehicleType.CAR,
  status: VehicleStatus.AVAILABLE,
  condition: VehicleCondition.USED,
  bodyType: 'Sedan',
  engineDisplacement: undefined,
  category: undefined,
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCreateVehicleDto = (
  overrides: Partial<CreateVehicleDto> = {}
): CreateVehicleDto => ({
  vin: `VIN${String(vehicleIdCounter++).padStart(14, '0')}`,
  make: 'Honda',
  model: 'Accord',
  year: 2023,
  color: 'Silver',
  mileage: 0,
  price: 30000,
  cost: 25000,
  type: VehicleType.CAR,
  status: VehicleStatus.AVAILABLE,
  condition: VehicleCondition.NEW,
  ...overrides,
});

export const createMockUpdateVehicleDto = (
  overrides: Partial<UpdateVehicleDto> = {}
): UpdateVehicleDto => ({
  price: 28000,
  status: VehicleStatus.RESERVED,
  ...overrides,
});

export const createMockMotorcycle = (overrides: Partial<Vehicle> = {}): Vehicle =>
  createMockVehicle({
    make: 'Yamaha',
    model: 'MT-07',
    type: VehicleType.MOTORCYCLE,
    category: 'Naked',
    engineDisplacement: 689,
    bodyType: 'Motorcycle',
    ...overrides,
  });

export const createMockCreateMotorcycleDto = (
  overrides: Partial<CreateVehicleDto> = {}
): CreateVehicleDto =>
  createMockCreateVehicleDto({
    make: 'Kawasaki',
    model: 'Ninja 400',
    type: VehicleType.MOTORCYCLE,
    category: 'Sport',
    engineDisplacement: 399,
    bodyType: 'Motorcycle',
    ...overrides,
  });

export const resetVehicleIdCounter = () => {
  vehicleIdCounter = 1;
};
