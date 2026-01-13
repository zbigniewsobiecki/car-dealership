import api from './api';
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
} from '@car-dealership/shared-types';

export const vehiclesService = {
  async getAll(filters?: VehicleFilters) {
    const params = new URLSearchParams();
    if (filters?.make) params.append('make', filters.make);
    if (filters?.model) params.append('model', filters.model);
    if (filters?.yearMin) params.append('yearMin', filters.yearMin.toString());
    if (filters?.yearMax) params.append('yearMax', filters.yearMax.toString());
    if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
    if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.condition) params.append('condition', filters.condition);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/vehicles?${params.toString()}`);
    return response.data.data as Vehicle[];
  },

  async getById(id: string) {
    const response = await api.get(`/vehicles/${id}`);
    return response.data.data as Vehicle;
  },

  async create(data: CreateVehicleDto) {
    const response = await api.post('/vehicles', data);
    return response.data.data as Vehicle;
  },

  async update(id: string, data: UpdateVehicleDto) {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data.data as Vehicle;
  },

  async delete(id: string) {
    await api.delete(`/vehicles/${id}`);
  },

  async getStats() {
    const response = await api.get('/vehicles/stats');
    return response.data.data;
  },
};
