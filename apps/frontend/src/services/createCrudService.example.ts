/**
 * Examples of using createCrudService to refactor existing services
 *
 * This file demonstrates how to use the CRUD service factory to reduce boilerplate
 * and how to extend it with custom methods.
 */

import api from './api';
import { createCrudService } from './createCrudService';
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
  VehicleStats,
  Sale,
  CreateSaleDto,
  UpdateSaleDto,
  Repair,
  CreateRepairDto,
  UpdateRepairDto,
  RepairFilters,
} from '@car-dealership/shared-types';

// Example 1: Simple CRUD service (no filters, array response)
// This is the simplest use case - just the basic CRUD operations
export const customersServiceExample = createCrudService<
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto
>('/customers');

// Example 2: CRUD service with custom methods
// Extend the base service with entity-specific methods using the spread operator
export const customersServiceWithCustomMethods = {
  ...createCrudService<Customer, CreateCustomerDto, UpdateCustomerDto>('/customers'),

  // Add custom methods specific to customers
  async getSales(id: string) {
    const response = await api.get(`/customers/${id}/sales`);
    return response.data.data;
  },
};

// Example 3: CRUD service with filters and pagination
// Use the filters generic and paginated config for services that support filtering
export const vehiclesServiceExample = {
  ...createCrudService<Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleFilters>(
    '/vehicles',
    { paginated: true }
  ),

  // Add vehicle-specific methods
  async getStats(): Promise<VehicleStats> {
    const response = await api.get('/vehicles/stats');
    return response.data.data as VehicleStats;
  },

  async getRecent(limit: number = 5): Promise<Vehicle[]> {
    const response = await api.get(`/vehicles/recent?limit=${limit}`);
    return response.data.data as Vehicle[];
  },
};

// Example 4: Multiple custom methods
export const salesServiceExample = {
  ...createCrudService<Sale, CreateSaleDto, UpdateSaleDto>('/sales'),

  async getStats() {
    const response = await api.get('/sales/stats');
    return response.data.data;
  },

  async getMonthlyStats() {
    const response = await api.get('/sales/stats/monthly');
    return response.data.data;
  },
};

// Example 5: CRUD service with complex filters
// The factory handles building URLSearchParams from any filter object
export const repairsServiceExample = createCrudService<
  Repair,
  CreateRepairDto,
  UpdateRepairDto,
  RepairFilters & { page?: number; limit?: number }
>('/repairs', { paginated: true });

// Example 6: Overriding a base method
// You can override any of the base CRUD methods if needed
export const customOverrideExample = {
  ...createCrudService<Customer, CreateCustomerDto, UpdateCustomerDto>('/customers'),

  // Override the update method with custom logic
  async update(id: string, data: UpdateCustomerDto) {
    // Custom pre-processing
    const processedData = { ...data, updatedAt: new Date().toISOString() };

    // Call the original logic
    const response = await api.put(`/customers/${id}`, processedData);
    return response.data.data as Customer;
  },
};

// Benefits of using the factory:
// 1. Reduces boilerplate - no need to write the same CRUD methods repeatedly
// 2. Type-safe - full TypeScript generics for entities, DTOs, and filters
// 3. Consistent - all services follow the same pattern
// 4. Extensible - easily add custom methods with spread operator
// 5. Maintainable - changes to CRUD logic only need to be made in one place
// 6. Testable - the factory itself is tested, reducing test duplication
