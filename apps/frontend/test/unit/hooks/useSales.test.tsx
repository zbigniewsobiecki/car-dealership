import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import {
  useSales,
  useSale,
  useCreateSale,
  useUpdateSale,
  useDeleteSale,
  useSalesStats,
  useMonthlySalesStats,
} from '../../../src/hooks/useSales';

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

describe('useSales hooks', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('useSales', () => {
    it('should fetch all sales', async () => {
      const { result } = renderHook(() => useSales(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });

  describe('useSale', () => {
    it('should fetch a sale by id', async () => {
      const { result } = renderHook(() => useSale('sale-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe('sale-1');
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useSale(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useCreateSale', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useCreateSale(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useUpdateSale', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useUpdateSale(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useDeleteSale', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useDeleteSale(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useSalesStats', () => {
    it('should fetch sales stats', async () => {
      const { result } = renderHook(() => useSalesStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data).toHaveProperty('total_sales');
    });
  });

  describe('useMonthlySalesStats', () => {
    it('should fetch monthly sales stats', async () => {
      const { result } = renderHook(() => useMonthlySalesStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
    });
  });
});
