import api from './api';
import { Sale, CreateSaleDto, UpdateSaleDto, PaginationParams } from '@car-dealership/shared-types';

export const salesService = {
  async getAll(params?: PaginationParams) {
    const response = await api.get('/sales', { params });
    return response.data.data as Sale[];
  },

  async getById(id: string) {
    const response = await api.get(`/sales/${id}`);
    return response.data.data as Sale;
  },

  async create(data: CreateSaleDto) {
    const response = await api.post('/sales', data);
    return response.data.data as Sale;
  },

  async update(id: string, data: UpdateSaleDto) {
    const response = await api.put(`/sales/${id}`, data);
    return response.data.data as Sale;
  },

  async delete(id: string) {
    await api.delete(`/sales/${id}`);
  },

  async getStats() {
    const response = await api.get('/sales/stats');
    return response.data.data;
  },

  async getMonthlyStats() {
    const response = await api.get('/sales/stats/monthly');
    return response.data.data;
  },
};
