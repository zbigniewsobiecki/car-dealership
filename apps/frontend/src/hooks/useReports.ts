import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';
import { RevenueReport } from '@car-dealership/shared-types';

export const useRevenueReport = (
  from?: string, 
  to?: string, 
  options?: Partial<UseQueryOptions<RevenueReport>>
) => {
  return useQuery({
    queryKey: ['reports', 'revenue', from, to],
    queryFn: () => reportsService.getRevenue(from, to),
    ...options,
  });
};