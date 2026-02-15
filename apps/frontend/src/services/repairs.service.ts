import api from './api';
import {
  Repair,
  CreateRepairDto,
  UpdateRepairDto,
  RepairFilters,
  RepairStats,
  PaginatedResponse,
} from '@car-dealership/shared-types';

export const repairsService = {
  async getAll(filters?: RepairFilters) {
    const params = new URLSearchParams();
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId);
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
    if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString());
    if (filters?.search) params.append('search', filters.search);
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

  async getStats(): Promise<RepairStats> {
    const response = await api.get('/repairs/stats');
    return response.data.data as RepairStats;
  },

  async getActive(limit: number = 10): Promise<Repair[]> {
    const response = await api.get(`/repairs/active?limit=${limit}`);
    return response.data.data as Repair[];
  },

  async getByVehicleId(vehicleId: string): Promise<Repair[]> {
    const response = await api.get(`/repairs/vehicle/${vehicleId}`);
    return response.data.data as Repair[];
  },

  async getByCustomerId(customerId: string): Promise<Repair[]> {
    const response = await api.get(`/repairs/customer/${customerId}`);
    return response.data.data as Repair[];
  },
};
