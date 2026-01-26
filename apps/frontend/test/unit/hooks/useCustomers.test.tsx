import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '../../../src/hooks/useCustomers';

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
};

describe('useCustomers hooks', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('useCustomers', () => {
    it('should fetch all customers', async () => {
      const { result } = renderHook(() => useCustomers(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });

  describe('useCustomer', () => {
    it('should fetch a customer by id', async () => {
      const { result } = renderHook(() => useCustomer('customer-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe('customer-1');
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useCustomer(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useCreateCustomer', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useCreateCustomer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useUpdateCustomer', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useUpdateCustomer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useDeleteCustomer', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useDeleteCustomer(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });
});
