import { AxiosInstance } from 'axios';
import api from './api';
import { PaginatedResponse } from '@car-dealership/shared-types';

export interface CrudServiceConfig {
  /**
   * Custom axios instance (defaults to the api singleton)
   */
  apiInstance?: AxiosInstance;
  /**
   * Whether getAll returns paginated response (default: false)
   */
  paginated?: boolean;
}

export interface CrudService<T, CreateDto, UpdateDto, Filters = Record<string, unknown>> {
  getAll(filters?: Filters): Promise<T[] | PaginatedResponse<T>>;
  getById(id: string): Promise<T>;
  create(data: CreateDto): Promise<T>;
  update(id: string, data: UpdateDto): Promise<T>;
  delete(id: string): Promise<void>;
}

/**
 * Builds URLSearchParams from a filters object, handling undefined/null values
 */
function buildSearchParams(filters?: Record<string, unknown>): URLSearchParams {
  const params = new URLSearchParams();

  if (!filters) {
    return params;
  }

  Object.entries(filters).forEach(([key, value]) => {
    // Skip undefined and null values
    if (value === undefined || value === null) {
      return;
    }

    // Convert numbers and booleans to strings
    if (typeof value === 'number' || typeof value === 'boolean') {
      params.append(key, value.toString());
    } else if (typeof value === 'string') {
      params.append(key, value);
    }
  });

  return params;
}

/**
 * Factory function to create a CRUD service for an entity
 *
 * @template T - The entity type
 * @template CreateDto - The DTO type for creating an entity
 * @template UpdateDto - The DTO type for updating an entity
 * @template Filters - The filters type for querying entities (optional)
 *
 * @param basePath - The base API path (e.g., '/customers', '/vehicles')
 * @param config - Optional configuration
 *
 * @returns A CRUD service object with getAll, getById, create, update, and delete methods
 *
 * @example
 * // Basic usage
 * const customersService = createCrudService<Customer, CreateCustomerDto, UpdateCustomerDto>(
 *   '/customers'
 * );
 *
 * @example
 * // With filters and pagination
 * const vehiclesService = createCrudService<
 *   Vehicle,
 *   CreateVehicleDto,
 *   UpdateVehicleDto,
 *   VehicleFilters
 * >('/vehicles', { paginated: true });
 *
 * @example
 * // Extended with custom methods
 * const customersService = {
 *   ...createCrudService<Customer, CreateCustomerDto, UpdateCustomerDto>('/customers'),
 *   async getSales(id: string) {
 *     const response = await api.get(`/customers/${id}/sales`);
 *     return response.data.data;
 *   }
 * };
 */
export function createCrudService<
  T,
  CreateDto,
  UpdateDto,
  Filters extends Record<string, unknown> = Record<string, unknown>
>(
  basePath: string,
  config?: CrudServiceConfig
): CrudService<T, CreateDto, UpdateDto, Filters> {
  const apiInstance = config?.apiInstance || api;
  const isPaginated = config?.paginated ?? false;

  return {
    async getAll(filters?: Filters): Promise<T[] | PaginatedResponse<T>> {
      const params = buildSearchParams(filters);
      const queryString = params.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const response = await apiInstance.get(url);

      if (isPaginated) {
        return response.data as PaginatedResponse<T>;
      }

      return response.data.data as T[];
    },

    async getById(id: string): Promise<T> {
      const response = await apiInstance.get(`${basePath}/${id}`);
      return response.data.data as T;
    },

    async create(data: CreateDto): Promise<T> {
      const response = await apiInstance.post(basePath, data);
      return response.data.data as T;
    },

    async update(id: string, data: UpdateDto): Promise<T> {
      const response = await apiInstance.put(`${basePath}/${id}`, data);
      return response.data.data as T;
    },

    async delete(id: string): Promise<void> {
      await apiInstance.delete(`${basePath}/${id}`);
    },
  };
}
