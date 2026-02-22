import api from './api';
import { RevenueReport } from '@car-dealership/shared-types';

export const reportsService = {
  async getRevenue(from?: string, to?: string) {
    const response = await api.get('/reports/revenue', {
      params: { from, to },
    });
    return response.data.data as RevenueReport;
  },
};