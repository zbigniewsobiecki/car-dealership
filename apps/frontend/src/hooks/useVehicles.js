import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesService } from '../services/vehicles.service';
export const useVehicles = (filters) => {
    return useQuery({
        queryKey: ['vehicles', filters],
        queryFn: () => vehiclesService.getAll(filters),
    });
};
export const useVehicle = (id) => {
    return useQuery({
        queryKey: ['vehicles', id],
        queryFn: () => vehiclesService.getById(id),
        enabled: !!id,
    });
};
export const useCreateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => vehiclesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
export const useUpdateVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => vehiclesService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
export const useDeleteVehicle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => vehiclesService.delete(id),
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
export const useRecentVehicles = (limit) => {
    return useQuery({
        queryKey: ['vehicles', 'recent', limit],
        queryFn: () => vehiclesService.getRecent(limit),
    });
};
//# sourceMappingURL=useVehicles.js.map