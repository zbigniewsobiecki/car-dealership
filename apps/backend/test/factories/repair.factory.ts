import { Repair, CreateRepairDto, UpdateRepairDto, RepairStatus } from '@car-dealership/shared-types';

let repairIdCounter = 1;

export const createMockRepair = (overrides: Partial<Repair> = {}): Repair => ({
  id: `repair-${repairIdCounter++}`,
  vehicleId: 'vehicle-1',
  customerId: 'customer-1',
  description: 'Oil change and brake inspection',
  status: RepairStatus.PENDING,
  cost: 150,
  startDate: new Date(),
  endDate: undefined,
  technician: 'John Doe',
  notes: 'Test repair',
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user-1',
  ...overrides,
});

export const createMockCreateRepairDto = (
  overrides: Partial<CreateRepairDto> = {}
): CreateRepairDto => ({
  vehicleId: 'vehicle-1',
  customerId: 'customer-1',
  description: 'Transmission repair',
  status: RepairStatus.PENDING,
  cost: 500,
  startDate: new Date(),
  endDate: undefined,
  technician: 'Jane Smith',
  notes: 'New repair',
  ...overrides,
});

export const createMockUpdateRepairDto = (
  overrides: Partial<UpdateRepairDto> = {}
): UpdateRepairDto => ({
  status: RepairStatus.COMPLETED,
  endDate: new Date(),
  ...overrides,
});

export const resetRepairIdCounter = () => {
  repairIdCounter = 1;
};
