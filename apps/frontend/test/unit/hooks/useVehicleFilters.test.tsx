import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVehicleFilters } from '../../../src/hooks/useVehicleFilters';
import { VehicleType } from '@car-dealership/shared-types';

describe('useVehicleFilters', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with default values when no initialLimit provided', () => {
      const { result } = renderHook(() => useVehicleFilters());

      expect(result.current.searchTerm).toBe('');
      expect(result.current.priceMin).toBe('');
      expect(result.current.priceMax).toBe('');
      expect(result.current.type).toBe('');
      expect(result.current.page).toBe(1);
      expect(result.current.limit).toBe(10);
      expect(result.current.filters).toEqual({ page: 1, limit: 10 });
      expect(result.current.isFiltered).toBe(false);
    });

    it('should initialize with custom limit when initialLimit provided', () => {
      const { result } = renderHook(() => useVehicleFilters(25));

      expect(result.current.limit).toBe(25);
      expect(result.current.filters).toEqual({ page: 1, limit: 25 });
    });
  });

  describe('handleSearch', () => {
    it('should update filters with search term and reset page to 1', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      // Set some values and page to 3
      act(() => {
        result.current.handlePageChange(3);
        result.current.setSearchTerm('Toyota');
        result.current.setPriceMin('10000');
        result.current.setPriceMax('50000');
        result.current.setType(VehicleType.CAR);
      });

      // Call handleSearch
      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(result.current.page).toBe(1);
      expect(result.current.filters).toEqual({
        search: 'Toyota',
        priceMin: 10000,
        priceMax: 50000,
        type: VehicleType.CAR,
        page: 1,
        limit: 10,
      });
    });

    it('should handle empty price and type fields by removing them from filters', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      // Set only search term
      act(() => {
        result.current.setSearchTerm('Honda');
        result.current.setPriceMin('');
        result.current.setPriceMax('');
        result.current.setType('');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.filters).toEqual({
        search: 'Honda',
        page: 1,
        limit: 10,
      });
      expect(result.current.filters).not.toHaveProperty('priceMin');
      expect(result.current.filters).not.toHaveProperty('priceMax');
      expect(result.current.filters).not.toHaveProperty('type');
    });

    it('should convert price strings to numbers in filters', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setPriceMin('15000');
        result.current.setPriceMax('30000');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.filters.priceMin).toBe(15000);
      expect(result.current.filters.priceMax).toBe(30000);
      expect(typeof result.current.filters.priceMin).toBe('number');
      expect(typeof result.current.filters.priceMax).toBe('number');
    });

    it('should reset page to 1 even when already on page 1', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      // Page is already 1 by default, just set search term
      act(() => {
        result.current.setSearchTerm('BMW');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.page).toBe(1);
      expect(result.current.filters.page).toBe(1);
    });
  });

  describe('handlePageChange', () => {
    it('should update page state and filters.page property', () => {
      const { result } = renderHook(() => useVehicleFilters());

      act(() => {
        result.current.handlePageChange(3);
      });

      expect(result.current.page).toBe(3);
      expect(result.current.filters.page).toBe(3);
    });

    it('should call window.scrollTo with (0, 0)', () => {
      const { result } = renderHook(() => useVehicleFilters());

      act(() => {
        result.current.handlePageChange(2);
      });

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should preserve other filter properties when changing page', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      // First set some filters
      act(() => {
        result.current.setSearchTerm('Ford');
        result.current.setPriceMin('5000');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      // Then change page
      act(() => {
        result.current.handlePageChange(2);
      });

      expect(result.current.filters).toEqual({
        search: 'Ford',
        priceMin: 5000,
        page: 2,
        limit: 10,
      });
    });
  });

  describe('handleClear', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useVehicleFilters(15));
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      // Set some values and page to 5
      act(() => {
        result.current.handlePageChange(5);
        result.current.setSearchTerm('Tesla');
        result.current.setPriceMin('40000');
        result.current.setPriceMax('80000');
        result.current.setType(VehicleType.CAR);
      });

      // Apply filters
      act(() => {
        result.current.handleSearch(mockEvent);
      });

      // Clear everything
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.searchTerm).toBe('');
      expect(result.current.priceMin).toBe('');
      expect(result.current.priceMax).toBe('');
      expect(result.current.type).toBe('');
      expect(result.current.page).toBe(1);
      expect(result.current.filters).toEqual({ page: 1, limit: 15 });
      expect(result.current.isFiltered).toBe(false);
    });

    it('should reset page to 1 and clear all input fields', () => {
      const { result } = renderHook(() => useVehicleFilters());

      // Set page to 3 and search term
      act(() => {
        result.current.handlePageChange(3);
        result.current.setSearchTerm('Audi');
      });

      // Apply search (so that search filter is in filters object)
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;
      act(() => {
        result.current.handleSearch(mockEvent);
      });

      // Clear
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.page).toBe(1);
      expect(result.current.searchTerm).toBe('');
      expect(result.current.filters.page).toBe(1);
      expect(result.current.filters).not.toHaveProperty('search');
    });
  });

  describe('isFiltered', () => {
    it('should be false initially', () => {
      const { result } = renderHook(() => useVehicleFilters());
      expect(result.current.isFiltered).toBe(false);
    });

    it('should be true when search filter is applied', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setSearchTerm('Mercedes');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);
    });

    it('should be true when priceMin filter is applied', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setPriceMin('20000');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);
    });

    it('should be true when priceMax filter is applied', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setPriceMax('40000');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);
    });

    it('should be true when type filter is applied', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      act(() => {
        result.current.setType(VehicleType.MOTORCYCLE);
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);
    });

    it('should be false after handleClear', () => {
      const { result } = renderHook(() => useVehicleFilters());
      const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent;

      // Apply a filter
      act(() => {
        result.current.setSearchTerm('Jeep');
      });

      act(() => {
        result.current.handleSearch(mockEvent);
      });

      expect(result.current.isFiltered).toBe(true);

      // Clear
      act(() => {
        result.current.handleClear();
      });

      expect(result.current.isFiltered).toBe(false);
    });
  });
});