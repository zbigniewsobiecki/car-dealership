import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '../services/vehicles.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
} from '@car-dealership/shared-types';

export const useVehicles = (filters?: VehicleFilters) => {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => vehiclesService.getAll(filters),
  });
};

export const useVehicle = (id: string) => {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: () => vehiclesService.getById(id),
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleDto) => vehiclesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateVehicleDto }) =>
      vehiclesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vehiclesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};

export const useVehicleStats = () => {
  return useQuery({
    queryKey: ['vehicles', 'stats'],
    queryFn: () => vehiclesService.getStats(),
  });
};
