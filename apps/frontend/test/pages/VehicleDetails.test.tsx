import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleDetails } from '../../src/pages/VehicleDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useVehicle } from '../../src/hooks/useVehicles';
import { useRepairs, useCreateRepair, useUpdateRepair, useDeleteRepair } from '../../src/hooks/useRepairs';
import { VehicleType, VehicleStatus, RepairStatus, CreateRepairDto, UpdateRepairDto } from '@car-dealership/shared-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the hooks
vi.mock('../../src/hooks/useVehicles', () => ({
  useVehicle: vi.fn(),
  useVehicles: vi.fn(() => ({ data: { data: [] } })),
}));

vi.mock('../../src/hooks/useCustomers', () => ({
  useCustomers: vi.fn(() => ({ data: [] })),
}));

vi.mock('../../src/hooks/useRepairs', () => ({
  useRepairs: vi.fn(),
  useCreateRepair: vi.fn(),
  useUpdateRepair: vi.fn(),
  useDeleteRepair: vi.fn(),
}));

const mockVehicle = {
  id: 'vehicle-1',
  year: 2022,
  make: 'Toyota',
  model: 'Camry',
  vin: 'VIN123456',
  price: 25000,
  status: VehicleStatus.AVAILABLE,
  type: VehicleType.CAR,
  mileage: 15000,
  condition: 'used',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRepairs = [
  {
    id: 'repair-1',
    vehicleId: 'vehicle-1',
    customerId: 'customer-1',
    description: 'Oil change and tire rotation',
    status: RepairStatus.COMPLETED,
    cost: 150,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-02'),
    technician: 'John Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const renderVehicleDetails = (vehicleId = 'vehicle-1') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/vehicles/${vehicleId}`]}>
        <Routes>
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('VehicleDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateRepair).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as unknown as ReturnType<typeof useCreateRepair>);
    vi.mocked(useUpdateRepair).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as unknown as ReturnType<typeof useUpdateRepair>);
    vi.mocked(useDeleteRepair).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<typeof useDeleteRepair>);
  });

  it('renders loading state when vehicle is loading', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: true, data: undefined } as unknown as ReturnType<typeof useVehicle>);
    vi.mocked(useRepairs).mockReturnValue({ isLoading: false, data: undefined } as unknown as ReturnType<typeof useRepairs>);

    renderVehicleDetails();
    expect(screen.getByText(/Loading vehicle details.../i)).toBeInTheDocument();
  });

  it('renders vehicle details correctly', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as unknown as ReturnType<typeof useVehicle>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);

    renderVehicleDetails();

    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('VIN: VIN123456')).toBeInTheDocument();
  });

  it('opens RepairForm when Add Repair button is clicked', async () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as unknown as ReturnType<typeof useVehicle>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);

    renderVehicleDetails();

    const addButton = screen.getByRole('button', { name: /Add Repair/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/New Repair/i)).toBeInTheDocument();
  });

  it('calls useCreateRepair when form is submitted', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as unknown as ReturnType<typeof useVehicle>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);
    vi.mocked(useCreateRepair).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false } as unknown as ReturnType<typeof useCreateRepair>);

    renderVehicleDetails();

    fireEvent.click(screen.getByRole('button', { name: /Add Repair/i }));

    // Fill required fields in RepairForm
    fireEvent.change(screen.getByLabelText(/Customer/i), { target: { value: 'customer-1' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'New Repair' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Repair/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
        description: 'New Repair',
        vehicleId: 'vehicle-1',
      } as CreateRepairDto));
    });
  });

  it('calls useUpdateRepair when edit form is submitted', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as unknown as ReturnType<typeof useVehicle>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: mockRepairs, pagination: { total: 1, totalPages: 1, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);
    vi.mocked(useUpdateRepair).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false } as unknown as ReturnType<typeof useUpdateRepair>);

    renderVehicleDetails();

    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    expect(screen.getByText(/Edit Repair/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Updated Description' } });
    fireEvent.click(screen.getByRole('button', { name: /Update Repair/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
        id: 'repair-1',
        data: expect.objectContaining({
          description: 'Updated Description',
        } as UpdateRepairDto),
      }));
    });
  });

  it('calls useDeleteRepair when delete button is clicked and confirmed', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as unknown as ReturnType<typeof useVehicle>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: mockRepairs, pagination: { total: 1, totalPages: 1, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);
    vi.mocked(useDeleteRepair).mockReturnValue({ mutateAsync: mockMutateAsync } as unknown as ReturnType<typeof useDeleteRepair>);

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderVehicleDetails();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutateAsync).toHaveBeenCalledWith('repair-1');
  });
});