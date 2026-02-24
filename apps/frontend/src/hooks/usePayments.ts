import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService } from '../services/payments.service';

export const useStripeConfig = () => {
  return useQuery({
    queryKey: ['stripe-config'],
    queryFn: () => paymentsService.getConfig(),
    staleTime: Infinity, // Config doesn't change during session
  });
};

export const usePaymentIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (repairId: string) => paymentsService.createPaymentIntent(repairId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentIntentId: string) => paymentsService.confirmPayment(paymentIntentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
    },
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentsService.getById(id),
    enabled: !!id,
  });
};

export const usePayments = (filters?: { repairId?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => paymentsService.getAll(filters),
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentId, amount }: { paymentId: string; amount?: number }) =>
      paymentsService.refundPayment(paymentId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};
