import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRepairFilters } from '../../../src/hooks/useRepairFilters';
import { RepairStatus } from '@car-dealership/shared-types';

describe('useRepairFilters', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with default values when no initialLimit provided', () => {
      const { result } = renderHook(() => useRepairFilters());

      expect(result.current.status).toBe('');
      expect(result.current.technician).toBe('');
      expect(result.current.page).toBe(1);
      expect(result.current.limit).toBe(10);
      expect(result.current.filters).toEqual({ page: 1, limit: 10 });
      expect(result.current.isFiltered).toBe(false);
    });

    it('should initialize with custom limit when initialLimit provided', () => {
      const { result } = renderHook(() => useRepairFilters(25));

      expect(result.current.limit).toBe(25);
      expect(result.current.filters).toEqual({ page: 1, limit: 25 });
    });
  });

  describe('handleSearch', () => {
    it('should update filters with status and technician and reset page to 1', () => {
      const { result } = renderHook(() => useRepairFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.handlePageChange(3);
        result.current.setStatus(RepairStatus.IN_PROGRESS);
        result.current.setTechnician('John Doe');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.page).toBe(1);
      expect(result.current.filters).toEqual({
        status: RepairStatus.IN_PROGRESS,
        technician: 'John Doe',
        page: 1,
        limit: 10,
      });
    });

    it('should handle empty fields by removing them from filters', () => {
      const { result } = renderHook(() => useRepairFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setStatus('');
        result.current.setTechnician('  ');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.filters).toEqual({
        page: 1,
        limit: 10,
      });
      expect(result.current.filters).not.toHaveProperty('status');
      expect(result.current.filters).not.toHaveProperty('technician');
    });
  });

  describe('handlePageChange', () => {
    it('should update page state and filters.page property', () => {
      const { result } = renderHook(() => useRepairFilters());

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(result.current.page).toBe(3);
      expect(result.current.filters.page).toBe(3);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should preserve other filter properties when changing page', () => {
      const { result } = renderHook(() => useRepairFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setStatus(RepairStatus.COMPLETED);
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.filters).toEqual({
        status: RepairStatus.COMPLETED,
        page: 2,
        limit: 10,
      });
    });
  });

  describe('handleClear', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useRepairFilters(15));
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.handlePageChange(5);
        result.current.setStatus(RepairStatus.PENDING);
        result.current.setTechnician('Jane Smith');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      act(() => {
        result.current.handleClear();
      });

      expect(result.current.status).toBe('');
      expect(result.current.technician).toBe('');
      expect(result.current.page).toBe(1);
      expect(result.current.filters).toEqual({ page: 1, limit: 15 });
      expect(result.current.isFiltered).toBe(false);
    });
  });

  describe('isFiltered', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() => useRepairFilters());
      expect(result.current.isFiltered).toBe(false);
    });

    it('should be true when status filter is applied', () => {
      const { result } = renderHook(() => useRepairFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setStatus(RepairStatus.IN_PROGRESS);
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);
    });

    it('should be true when technician filter is applied', () => {
      const { result } = renderHook(() => useRepairFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setTechnician('John');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);
    });
  });
});