import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repairsService } from '../services/repairs.service';
import {
  CreateRepairDto,
  UpdateRepairDto,
  RepairFilters,
} from '@car-dealership/shared-types';

export const useRepairs = (filters?: RepairFilters) => {
  return useQuery({
    queryKey: ['repairs', filters],
    queryFn: () => repairsService.getAll(filters),
  });
};

export const useRepair = (id: string) => {
  return useQuery({
    queryKey: ['repairs', id],
    queryFn: () => repairsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRepairDto) => repairsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
    },
  });
};

export const useUpdateRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRepairDto }) =>
      repairsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
    },
  });
};

export const useDeleteRepair = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repairsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
    },
  });
};
