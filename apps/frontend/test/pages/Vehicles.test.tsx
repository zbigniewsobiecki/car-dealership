import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Vehicles } from '../../src/pages/Vehicles';
import { MemoryRouter } from 'react-router-dom';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from '../../src/hooks/useVehicles';
import { useVehicleFilters } from '../../src/hooks/useVehicleFilters';
import { Vehicle, VehicleStatus, VehicleType } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useVehicles', () => ({
  useVehicles: vi.fn(),
  useCreateVehicle: vi.fn(),
  useUpdateVehicle: vi.fn(),
  useDeleteVehicle: vi.fn(),
}));

vi.mock('../../src/hooks/useVehicleFilters', () => ({
  useVehicleFilters: vi.fn(),
}));

// Mock the VehicleForm component
vi.mock('../../src/components/vehicles/VehicleForm', () => ({
  VehicleForm: ({ vehicle, onSubmit, onCancel, isLoading }) => (
    <div data-testid="vehicle-form">
      <div data-testid="form-vehicle">{vehicle ? 'edit' : 'add'}</div>
      <button onClick={() => onSubmit({
        vin: 'VIN123',
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        price: 25000,
        mileage: 15000,
        type: VehicleType.CAR,
        status: VehicleStatus.AVAILABLE,
      })}>
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

// Mock the VehicleCard component
vi.mock('../../src/components/vehicles/VehicleCard', () => ({
  VehicleCard: ({ vehicle, onEdit, onDelete }) => (
    <div data-testid="vehicle-card">
      <div data-testid="vehicle-info">{vehicle.year} {vehicle.make} {vehicle.model}</div>
      <button onClick={() => onEdit(vehicle)}>Edit</button>
      <button onClick={() => onDelete(vehicle)}>Delete</button>
    </div>
  ),
}));

// Mock the VehicleFilterBar component
vi.mock('../../src/components/vehicles/VehicleFilterBar', () => ({
  VehicleFilterBar: ({ onSearch, onClear, isFiltered }) => (
    <div data-testid="vehicle-filter-bar">
      <button onClick={onSearch}>Search</button>
      {isFiltered && <button onClick={onClear}>Clear</button>}
    </div>
  ),
}));

// Mock the Pagination component
vi.mock('../../src/components/shared/Pagination', () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  ),
}));

const renderVehicles = () => {
  return render(
    <MemoryRouter>
      <Vehicles />
    </MemoryRouter>
  );
};

// Mock vehicle data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    vin: 'VIN123',
    year: 2022,
    make: 'Toyota',
    model: 'Camry',
    type: VehicleType.CAR,
    status: VehicleStatus.AVAILABLE,
    condition: 'excellent',
    mileage: 15000,
    price: 25000,
    color: 'Blue',
    transmission: 'automatic',
    fuelType: 'gasoline',
    engineDisplacement: 2.5,
    bodyType: 'sedan',
    category: 'standard',
    location: 'Main Lot',
    notes: 'Well maintained',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    vin: 'VIN456',
    year: 2023,
    make: 'Honda',
    model: 'Civic',
    type: VehicleType.CAR,
    status: VehicleStatus.SOLD,
    condition: 'good',
    mileage: 5000,
    price: 28000,
    color: 'Red',
    transmission: 'manual',
    fuelType: 'gasoline',
    engineDisplacement: 2.0,
    bodyType: 'sedan',
    category: 'sport',
    location: 'Showroom',
    notes: null,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

const mockPaginatedResponse = {
  data: mockVehicles,
  pagination: {
    total: 2,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

describe('Vehicles Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useVehicleFilters).mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      priceMin: '',
      setPriceMin: vi.fn(),
      priceMax: '',
      setPriceMax: vi.fn(),
      type: '',
      setType: vi.fn(),
      page: 1,
      filters: {},
      handleSearch: vi.fn(),
      handlePageChange: vi.fn(),
      handleClear: vi.fn(),
      isFiltered: false,
      limit: 10,
    } as never);

    vi.mocked(useVehicles).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    vi.mocked(useCreateVehicle).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    vi.mocked(useUpdateVehicle).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    vi.mocked(useDeleteVehicle).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
  });

  it('renders loading state when data is fetching', () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as never);

    renderVehicles();
    expect(screen.getByText(/Loading vehicles.../i)).toBeInTheDocument();
  });

  it('renders empty state when no vehicles exist', () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderVehicles();
    expect(screen.getByText(/No vehicles yet. Add your first vehicle!/i)).toBeInTheDocument();
  });

  it('renders vehicle list when vehicles exist', () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderVehicles();
    expect(screen.getAllByTestId('vehicle-card')).toHaveLength(2);
    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('2023 Honda Civic')).toBeInTheDocument();
  });

  it('renders Add Vehicle button', () => {
    renderVehicles();
    expect(screen.getByText('Add Vehicle')).toBeInTheDocument();
  });

  it('renders pagination when vehicles exist', () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderVehicles();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('opens Add Vehicle form when Add Vehicle button is clicked', () => {
    renderVehicles();
    fireEvent.click(screen.getByText('Add Vehicle'));
    expect(screen.getByTestId('vehicle-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-vehicle')).toHaveTextContent('add');
  });

  it('opens Edit Vehicle form when Edit button is clicked on a vehicle card', () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderVehicles();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByTestId('vehicle-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-vehicle')).toHaveTextContent('edit');
  });

  it('calls deleteMutation.mutateAsync when Delete button is clicked and confirmed', async () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockDeleteMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteVehicle).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderVehicles();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete 2022 Toyota Camry?');
    expect(mockDeleteMutation).toHaveBeenCalledWith('1');
    mockConfirm.mockRestore();
  });

  it('does not call deleteMutation.mutateAsync when Delete button is clicked but cancelled', () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const mockDeleteMutation = vi.fn();
    vi.mocked(useDeleteVehicle).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderVehicles();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteMutation).not.toHaveBeenCalled();
    mockConfirm.mockRestore();
  });

  it('calls createMutation.mutateAsync when Add Vehicle form is submitted', async () => {
    const mockCreateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateVehicle).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderVehicles();
    fireEvent.click(screen.getByText('Add Vehicle'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith({
        vin: 'VIN123',
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        price: 25000,
        mileage: 15000,
        type: VehicleType.CAR,
        status: VehicleStatus.AVAILABLE,
      });
    });
  });

  it('calls updateMutation.mutateAsync when Edit Vehicle form is submitted', async () => {
    vi.mocked(useVehicles).mockReturnValue({
      data: mockPaginatedResponse,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockUpdateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateVehicle).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderVehicles();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: '1',
        data: {
          vin: 'VIN123',
          year: 2022,
          make: 'Toyota',
          model: 'Camry',
          price: 25000,
          mileage: 15000,
          type: VehicleType.CAR,
          status: VehicleStatus.AVAILABLE,
        },
      });
    });
  });

  it('handles error when vehicle creation fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Creation failed');
    const mockCreateMutation = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useCreateVehicle).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderVehicles();
    fireEvent.click(screen.getByText('Add Vehicle'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save vehicle:', mockError);
    });

    consoleSpy.mockRestore();
  });

  it('closes form when Cancel button is clicked', () => {
    renderVehicles();
    fireEvent.click(screen.getByText('Add Vehicle'));
    expect(screen.getByTestId('vehicle-form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('vehicle-form')).not.toBeInTheDocument();
  });

  it('shows empty state with search message when filtered and no results', () => {
    vi.mocked(useVehicleFilters).mockReturnValue({
      searchTerm: 'Ferrari',
      setSearchTerm: vi.fn(),
      priceMin: '',
      setPriceMin: vi.fn(),
      priceMax: '',
      setPriceMax: vi.fn(),
      type: '',
      setType: vi.fn(),
      page: 1,
      filters: { search: 'Ferrari' },
      handleSearch: vi.fn(),
      handlePageChange: vi.fn(),
      handleClear: vi.fn(),
      isFiltered: true,
      limit: 10,
    } as never);

    vi.mocked(useVehicles).mockReturnValue({
      data: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderVehicles();
    expect(screen.getByText(/No vehicles found matching your search./i)).toBeInTheDocument();
  });
});
