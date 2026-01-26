import { Sale, CreateSaleDto, UpdateSaleDto, SaleStatus } from '@car-dealership/shared-types';

let saleIdCounter = 1;

export const createMockSale = (overrides: Partial<Sale> = {}): Sale => ({
  id: `sale-${saleIdCounter++}`,
  vehicleId: 'vehicle-1',
  customerId: 'customer-1',
  salesPersonId: 'user-1',
  salePrice: 24000,
  status: SaleStatus.PENDING,
  saleDate: new Date(),
  notes: 'Test sale',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCreateSaleDto = (
  overrides: Partial<CreateSaleDto> = {}
): CreateSaleDto => ({
  vehicleId: 'vehicle-1',
  customerId: 'customer-1',
  salesPersonId: 'user-1',
  salePrice: 25000,
  status: SaleStatus.PENDING,
  saleDate: new Date(),
  notes: 'New sale',
  ...overrides,
});

export const createMockUpdateSaleDto = (
  overrides: Partial<UpdateSaleDto> = {}
): UpdateSaleDto => ({
  status: SaleStatus.COMPLETED,
  ...overrides,
});

export const resetSaleIdCounter = () => {
  saleIdCounter = 1;
};
