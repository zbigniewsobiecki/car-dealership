import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customersService } from '../services/customers.service';
export const useCustomers = () => {
    return useQuery({
        queryKey: ['customers'],
        queryFn: () => customersService.getAll(),
    });
};
export const useCustomer = (id) => {
    return useQuery({
        queryKey: ['customers', id],
        queryFn: () => customersService.getById(id),
        enabled: !!id,
    });
};
export const useCreateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => customersService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};
export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => customersService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};
export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => customersService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
        },
    });
};
//# sourceMappingURL=useCustomers.js.map