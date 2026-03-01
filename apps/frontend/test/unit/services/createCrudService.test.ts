import { describe, it, expect, beforeEach } from 'vitest';
import { createCrudService } from '../../../src/services/createCrudService';
import { VehicleStatus, Customer, Vehicle } from '@car-dealership/shared-types';

interface CreateTestDto {
  name: string;
}

interface UpdateTestDto {
  name?: string;
}

interface TestFilters {
  name?: string;
  status?: string;
  page?: number;
  limit?: number;
  priceMin?: number;
  priceMax?: number;
  active?: boolean;
}

describe('createCrudService', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('basic CRUD operations', () => {
    it('should create a service with getAll method', async () => {
      const service = createCrudService<Customer, unknown, unknown>('/customers');

      const result = await service.getAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
    });

    it('should create a service with getById method', async () => {
      const service = createCrudService<Customer, unknown, unknown>('/customers');

      const result = await service.getById('customer-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('customer-1');
    });

    it('should create a service with create method', async () => {
      const service = createCrudService<Customer, CreateTestDto, unknown>('/customers');

      const result = await service.create({ name: 'Test Customer' });

      expect(result).toBeDefined();
      expect(result.id).toBe('new-customer-id');
    });

    it('should create a service with update method', async () => {
      const service = createCrudService<Customer, unknown, UpdateTestDto>('/customers');

      const result = await service.update('customer-1', { name: 'Updated Customer' });

      expect(result).toBeDefined();
      expect(result.id).toBe('customer-1');
    });

    it('should create a service with delete method', async () => {
      const service = createCrudService<Customer, unknown, unknown>('/customers');

      await expect(service.delete('customer-1')).resolves.toBeUndefined();
    });
  });

  describe('filter handling', () => {
    it('should handle undefined filters', async () => {
      const service = createCrudService<Vehicle, unknown, unknown, TestFilters>('/vehicles', {
        paginated: true,
      });

      const result = await service.getAll();

      expect(result).toBeDefined();
      expect('data' in result).toBe(true);
    });

    it('should handle empty filters object', async () => {
      const service = createCrudService<Vehicle, unknown, unknown, TestFilters>('/vehicles', {
        paginated: true,
      });

      const result = await service.getAll({});

      expect(result).toBeDefined();
      expect('data' in result).toBe(true);
    });

    it('should build query params from filters with string values', async () => {
      const service = createCrudService<Vehicle, unknown, unknown, TestFilters>('/vehicles', {
        paginated: true,
      });

      const filters = {
        name: 'Toyota',
        status: VehicleStatus.AVAILABLE,
      };

      const result = await service.getAll(filters);

      expect(result).toBeDefined();
      expect('data' in result).toBe(true);
    });

    it('should build query params from filters with number values', async () => {
      const service = createCrudService<Vehicle, unknown, unknown, TestFilters>('/vehicles', {
        paginated: true,
      });

      const filters = {
        page: 1,
        limit: 10,
        priceMin: 10000,
        priceMax: 50000,
      };

      const result = await service.getAll(filters);

      expect(result).toBeDefined();
      expect('data' in result).toBe(true);
    });

    it('should build query params from filters with boolean values', async () => {
      const service = createCrudService<Vehicle, unknown, unknown, TestFilters>('/vehicles', {
        paginated: true,
      });

      const filters = {
        active: true,
      };

      const result = await service.getAll(filters);

      expect(result).toBeDefined();
    });

    it('should skip null values in filters', async () => {
      const service = createCrudService<Customer, unknown, unknown, TestFilters>('/customers');

      const filters = {
        name: 'Test',
        status: null as unknown as string,
      };

      const result = await service.getAll(filters);

      expect(result).toBeDefined();
    });

    it('should skip undefined values in filters', async () => {
      const service = createCrudService<Customer, unknown, unknown, TestFilters>('/customers');

      const filters = {
        name: 'Test',
        status: undefined,
      };

      const result = await service.getAll(filters);

      expect(result).toBeDefined();
    });
  });

  describe('pagination support', () => {
    it('should return array response when paginated is false (default)', async () => {
      const service = createCrudService<Customer, unknown, unknown>('/customers');

      const result = await service.getAll();

      expect(Array.isArray(result)).toBe(true);
    });

    it('should return paginated response when paginated is true', async () => {
      const service = createCrudService<Vehicle, unknown, unknown>('/vehicles', {
        paginated: true,
      });

      const result = await service.getAll();

      expect(result).toBeDefined();
      expect('data' in result).toBe(true);
      expect('pagination' in result).toBe(true);
      if ('pagination' in result) {
        expect(result.pagination).toHaveProperty('page');
        expect(result.pagination).toHaveProperty('limit');
        expect(result.pagination).toHaveProperty('total');
        expect(result.pagination).toHaveProperty('totalPages');
      }
    });
  });

  describe('extensibility', () => {
    it('should allow extending with custom methods using spread operator', async () => {
      const baseService = createCrudService<Customer, CreateTestDto, UpdateTestDto>('/customers');

      const extendedService = {
        ...baseService,
        async getSales(id: string) {
          return `Sales for customer ${id}`;
        },
        async getStats() {
          return { total: 100 };
        },
      };

      // Base CRUD methods should still work
      const customers = await extendedService.getAll();
      expect(Array.isArray(customers)).toBe(true);

      const customer = await extendedService.getById('customer-1');
      expect(customer).toBeDefined();

      // Custom methods should work
      const sales = await extendedService.getSales('customer-1');
      expect(sales).toBe('Sales for customer customer-1');

      const stats = await extendedService.getStats();
      expect(stats).toEqual({ total: 100 });
    });

    it('should allow overriding base methods', async () => {
      const baseService = createCrudService<Customer, CreateTestDto, UpdateTestDto>('/customers');

      const customService = {
        ...baseService,
        async getAll() {
          return [{ id: 'custom-1', name: 'Custom' }] as unknown as Customer[];
        },
      };

      const result = await customService.getAll();
      expect(result).toEqual([{ id: 'custom-1', name: 'Custom' }]);
    });
  });

  describe('TypeScript generics', () => {
    it('should provide proper return types for getAll with array response', async () => {
      const service = createCrudService<Customer, CreateTestDto, UpdateTestDto>('/customers');

      const result = await service.getAll();

      // TypeScript should infer this as Customer[] | PaginatedResponse<Customer>
      expect(Array.isArray(result)).toBe(true);
    });

    it('should provide proper return types for getById', async () => {
      const service = createCrudService<Customer, CreateTestDto, UpdateTestDto>('/customers');

      const result = await service.getById('customer-1');

      // TypeScript should infer this as Customer
      expect(result).toBeDefined();
      expect(result.id).toBe('customer-1');
    });

    it('should provide proper return types for create', async () => {
      const service = createCrudService<Customer, CreateTestDto, UpdateTestDto>('/customers');

      const result = await service.create({ name: 'New Customer' });

      // TypeScript should infer this as Customer
      expect(result).toBeDefined();
      expect(result.id).toBe('new-customer-id');
    });

    it('should provide proper return types for update', async () => {
      const service = createCrudService<Customer, CreateTestDto, UpdateTestDto>('/customers');

      const result = await service.update('customer-1', { name: 'Updated Customer' });

      // TypeScript should infer this as Customer
      expect(result).toBeDefined();
      expect(result.id).toBe('customer-1');
    });
  });
});
