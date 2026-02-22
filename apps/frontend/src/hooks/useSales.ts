import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from '../services/sales.service';
import { CreateSaleDto, UpdateSaleDto, PaginationParams } from '@car-dealership/shared-types';

export const useSales = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['sales', params],
    queryFn: () => salesService.getAll(params),
  });
};

export const useSale = (id: string) => {
  return useQuery({
    queryKey: ['sales', id],
    queryFn: () => salesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleDto) => salesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSaleDto }) =>
      salesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => salesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useSalesStats = () => {
  return useQuery({
    queryKey: ['sales', 'stats'],
    queryFn: () => salesService.getStats(),
  });
};

export const useMonthlySalesStats = () => {
  return useQuery({
    queryKey: ['sales', 'stats', 'monthly'],
    queryFn: () => salesService.getMonthlyStats(),
  });
};
