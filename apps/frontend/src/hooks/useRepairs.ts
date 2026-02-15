import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { repairsService } from '../services/repairs.service';
import {
  CreateRepairDto,
  UpdateRepairDto,
  RepairFilters,
  RepairStats,
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
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
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
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
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

export const useRepairStats = () => {
  return useQuery<RepairStats>({
    queryKey: ['repairs', 'stats'],
    queryFn: () => repairsService.getStats(),
  });
};

export const useActiveRepairs = (limit?: number) => {
  return useQuery({
    queryKey: ['repairs', 'active', limit],
    queryFn: () => repairsService.getActive(limit),
  });
};

export const useRepairsByVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: ['repairs', 'vehicle', vehicleId],
    queryFn: () => repairsService.getByVehicleId(vehicleId),
    enabled: !!vehicleId,
  });
};

export const useRepairsByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ['repairs', 'customer', customerId],
    queryFn: () => repairsService.getByCustomerId(customerId),
    enabled: !!customerId,
  });
};
