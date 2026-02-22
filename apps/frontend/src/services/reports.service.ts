import api from './api';
import { RevenueReport } from '@car-dealership/shared-types';

export interface MonthlyStat {
  month: string;
  sales: number;
  revenue: number;
}

export const reportsService = {
  async getRevenueReport(from?: string, to?: string) {
    const response = await api.get('/reports/revenue', {
      params: { from, to },
    });
    return response.data.data as RevenueReport;
  },

  async getMonthlyStats() {
    const response = await api.get('/reports/monthly');
    return response.data.data as MonthlyStat[];
  },
};