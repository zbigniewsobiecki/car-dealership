import api from './api';
import {
  Payment,
  PaymentIntentResponse,
  PaginatedResponse,
} from '@car-dealership/shared-types';

export const paymentsService = {
  async getConfig() {
    const response = await api.get('/payments/config');
    return response.data.data as { publishableKey: string };
  },

  async createPaymentIntent(repairId: string) {
    const response = await api.post('/payments/intent', { repairId });
    return response.data.data as PaymentIntentResponse;
  },

  async confirmPayment(paymentIntentId: string) {
    const response = await api.post('/payments/confirm', { paymentIntentId });
    return response.data.data as Payment;
  },

  async getById(id: string) {
    const response = await api.get(`/payments/${id}`);
    return response.data.data as Payment;
  },

  async getAll(filters?: { repairId?: string; page?: number; limit?: number }) {
    const params = new URLSearchParams();
    if (filters?.repairId) params.append('repairId', filters.repairId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/payments?${params.toString()}`);
    return response.data as PaginatedResponse<Payment>;
  },

  async refundPayment(paymentId: string, amount?: number) {
    const response = await api.post(`/payments/${paymentId}/refund`, { amount });
    return response.data.data as Payment;
  },
};
