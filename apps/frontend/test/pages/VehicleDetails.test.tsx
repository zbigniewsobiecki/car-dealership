import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleDetails } from '../../src/pages/VehicleDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useVehicle } from '../../src/hooks/useVehicles';
import { useRepairs } from '../../src/hooks/useRepairs';
import { VehicleType, VehicleStatus, RepairStatus } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useVehicles', () => ({
  useVehicle: vi.fn(),
}));

vi.mock('../../src/hooks/useRepairs', () => ({
  useRepairs: vi.fn(),
  useCreateRepair: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateRepair: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useDeleteRepair: vi.fn(() => ({ mutateAsync: vi.fn() })),
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
  {
    id: 'repair-2',
    vehicleId: 'vehicle-1',
    customerId: 'customer-2',
    description: 'Brake pad replacement',
    status: RepairStatus.IN_PROGRESS,
    cost: 350,
    startDate: new Date('2024-01-10'),
    technician: 'Jane Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const renderVehicleDetails = (vehicleId = 'vehicle-1') => {
  return render(
    <MemoryRouter initialEntries={[`/vehicles/${vehicleId}`]}>
      <Routes>
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('VehicleDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when vehicle is loading', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: true, data: undefined } as never);
    vi.mocked(useRepairs).mockReturnValue({ isLoading: false, data: undefined } as never);

    renderVehicleDetails();
    expect(screen.getByText(/Loading vehicle details.../i)).toBeInTheDocument();
  });

  it('renders vehicle not found message when vehicle does not exist', async () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: undefined } as never);
    vi.mocked(useRepairs).mockReturnValue({ isLoading: false, data: undefined } as never);

    renderVehicleDetails();
    await waitFor(() => {
      expect(screen.getByText(/Vehicle not found/i)).toBeInTheDocument();
    });
  });

  it('renders vehicle details correctly', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderVehicleDetails();

    // Check vehicle information
    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('VIN: VIN123456')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('15,000 mi')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
  });

  it('displays repair history correctly when repairs exist', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: mockRepairs, pagination: { total: 2, totalPages: 1, currentPage: 1, perPage: 10 } },
    } as never);

    renderVehicleDetails();

    // Check repair history section
    expect(screen.getByText('Repair History')).toBeInTheDocument();
    expect(screen.getByText('Oil change and tire rotation')).toBeInTheDocument();
    expect(screen.getByText('Brake pad replacement')).toBeInTheDocument();
    expect(screen.getByText('Technician: John Smith')).toBeInTheDocument();
    expect(screen.getByText('Technician: Jane Doe')).toBeInTheDocument();
  });

  it('displays empty state when no repairs exist', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderVehicleDetails();

    expect(screen.getByText(/No repair history for this vehicle yet/i)).toBeInTheDocument();
  });

  it('filters repairs by vehicleId', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderVehicleDetails('vehicle-1');

    // Verify that useRepairs was called with the correct vehicleId filter
    expect(useRepairs).toHaveBeenCalledWith({ vehicleId: 'vehicle-1' });
  });

  it('renders Add Repair button', () => {
    vi.mocked(useVehicle).mockReturnValue({ isLoading: false, data: mockVehicle } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderVehicleDetails();

    expect(screen.getByRole('button', { name: /Add Repair/i })).toBeInTheDocument();
  });
});
