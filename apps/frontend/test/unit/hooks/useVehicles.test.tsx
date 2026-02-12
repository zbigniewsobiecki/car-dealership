import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import {
  useVehicles,
  useVehicle,
  useCreateVehicle,
  useDeleteVehicle,
  useVehicleStats,
} from '../../../src/hooks/useVehicles';
import { VehicleStatus } from '@car-dealership/shared-types';

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

describe('useVehicles hooks', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
  });

  describe('useVehicles', () => {
    it('should fetch all vehicles', async () => {
      const { result } = renderHook(() => useVehicles(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data?.data)).toBe(true);
      expect(result.current.data?.pagination).toBeDefined();
    });

    it('should fetch vehicles with filters', async () => {
      const filters = { make: 'Toyota', status: VehicleStatus.AVAILABLE };
      const { result } = renderHook(() => useVehicles(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
    });
  });

  describe('useVehicle', () => {
    it('should fetch a vehicle by id', async () => {
      const { result } = renderHook(() => useVehicle('vehicle-1'), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe('vehicle-1');
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useVehicle(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useCreateVehicle', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useCreateVehicle(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
    });
  });

  describe('useDeleteVehicle', () => {
    it('should provide mutation function', () => {
      const { result } = renderHook(() => useDeleteVehicle(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
    });
  });

  describe('useVehicleStats', () => {
    it('should fetch vehicle stats', async () => {
      const { result } = renderHook(() => useVehicleStats(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toBeDefined();
      expect(result.current.data).toHaveProperty('total');
    });
  });
});
