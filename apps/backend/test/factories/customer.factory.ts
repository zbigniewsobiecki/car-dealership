import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';

let customerIdCounter = 1;

export const createMockCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: `customer-${customerIdCounter++}`,
  firstName: 'John',
  lastName: 'Doe',
  email: `customer${customerIdCounter}@example.com`,
  phone: '555-0100',
  address: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '90210',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockCreateCustomerDto = (
  overrides: Partial<CreateCustomerDto> = {}
): CreateCustomerDto => ({
  firstName: 'Jane',
  lastName: 'Smith',
  email: `newcustomer${customerIdCounter++}@example.com`,
  phone: '555-0200',
  address: '456 Oak Ave',
  city: 'Somewhere',
  state: 'NY',
  zipCode: '10001',
  ...overrides,
});

export const createMockUpdateCustomerDto = (
  overrides: Partial<UpdateCustomerDto> = {}
): UpdateCustomerDto => ({
  phone: '555-9999',
  ...overrides,
});

export const resetCustomerIdCounter = () => {
  customerIdCounter = 1;
};
