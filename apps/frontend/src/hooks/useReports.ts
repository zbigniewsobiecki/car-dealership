import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';

export const useRevenueReport = (from?: string, to?: string) => {
  return useQuery({
    queryKey: ['reports', 'revenue', { from, to }],
    queryFn: () => reportsService.getRevenue(from, to),
  });
};

export const useMonthlyStats = () => {
  return useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: () => reportsService.getMonthlyStats(),
  });
};