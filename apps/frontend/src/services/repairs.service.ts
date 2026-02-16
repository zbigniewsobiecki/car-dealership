import api from './api';
import {
  Repair,
  CreateRepairDto,
  UpdateRepairDto,
  RepairFilters,
  PaginatedResponse,
} from '@car-dealership/shared-types';

export const repairsService = {
  async getAll(filters?: RepairFilters & { page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.technician) params.append('technician', filters.technician);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/repairs?${params.toString()}`);
    return response.data as PaginatedResponse<Repair>;
  },

  async getById(id: string) {
    const response = await api.get(`/repairs/${id}`);
    return response.data.data as Repair;
  },

  async create(data: CreateRepairDto) {
    const response = await api.post('/repairs', data);
    return response.data.data as Repair;
  },

  async update(id: string, data: UpdateRepairDto) {
    const response = await api.put(`/repairs/${id}`, data);
    return response.data.data as Repair;
  },

  async delete(id: string) {
    await api.delete(`/repairs/${id}`);
  },
};
