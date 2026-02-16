import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import {
  useRepairs,
  useRepair,
  useCreateRepair,
  useUpdateRepair,
  useDeleteRepair,
} from '../../../src/hooks/useRepairs';
import { RepairStatus } from '@car-dealership/shared-types';

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

describe('useRepairs hooks', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('useRepairs', () => {
    it('should fetch all repairs', async () => {
      const { result } = renderHook(() => useRepairs(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data?.data)).toBe(true);
      expect(result.current.data?.pagination).toBeDefined();
    });

    it('should fetch repairs with filters', async () => {
      const filters = { vehicleId: 'vehicle-1', status: RepairStatus.IN_PROGRESS };
      const { result } = renderHook(() => useRepairs(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
    });
  });

  describe('useRepair', () => {
    it('should fetch a repair by id', async () => {
      const { result } = renderHook(() => useRepair('repair-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe('repair-1');
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useRepair(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useCreateRepair', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useCreateRepair(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useUpdateRepair', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useUpdateRepair(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useDeleteRepair', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useDeleteRepair(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });
});
