import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { useRevenueReport } from '../../../src/hooks/useReports';

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

describe('useReports hooks', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('useRevenueReport', () => {
    it('should fetch revenue report', async () => {
      const { result } = renderHook(() => useRevenueReport('2024-01-01', '2024-01-31'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data).toHaveProperty('totalRevenue');
    });
  });
});