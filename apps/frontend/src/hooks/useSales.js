import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesService } from '../services/sales.service';
export const useSales = () => {
    return useQuery({
        queryKey: ['sales'],
        queryFn: () => salesService.getAll(),
    });
};
export const useSale = (id) => {
    return useQuery({
        queryKey: ['sales', id],
        queryFn: () => salesService.getById(id),
        enabled: !!id,
    });
};
export const useCreateSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => salesService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
export const useUpdateSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => salesService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sales'] });
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        },
    });
};
export const useDeleteSale = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => salesService.delete(id),
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
//# sourceMappingURL=useSales.js.map