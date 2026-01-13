import api from './api';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';

export const customersService = {
  async getAll() {
    const response = await api.get('/customers');
    return response.data.data as Customer[];
  },

  async getById(id: string) {
    const response = await api.get(`/customers/${id}`);
    return response.data.data as Customer;
  },

  async create(data: CreateCustomerDto) {
    const response = await api.post('/customers', data);
    return response.data.data as Customer;
  },

  async update(id: string, data: UpdateCustomerDto) {
    const response = await api.put(`/customers/${id}`, data);
    return response.data.data as Customer;
  },

  async delete(id: string) {
    await api.delete(`/customers/${id}`);
  },

  async getSales(id: string) {
    const response = await api.get(`/customers/${id}/sales`);
    return response.data.data;
  },
};
