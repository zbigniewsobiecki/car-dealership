import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerDetails } from '../../src/pages/CustomerDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useCustomer } from '../../src/hooks/useCustomers';
import { useRepairs, useCreateRepair, useUpdateRepair, useDeleteRepair } from '../../src/hooks/useRepairs';
import { RepairStatus, CreateRepairDto, UpdateRepairDto } from '@car-dealership/shared-types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the hooks
vi.mock('../../src/hooks/useCustomers', () => ({
  useCustomer: vi.fn(),
  useCustomers: vi.fn(() => ({ data: [] })),
}));

vi.mock('../../src/hooks/useVehicles', () => ({
  useVehicles: vi.fn(() => ({ data: { data: [] } })),
}));

vi.mock('../../src/hooks/useRepairs', () => ({
  useRepairs: vi.fn(),
  useCreateRepair: vi.fn(),
  useUpdateRepair: vi.fn(),
  useDeleteRepair: vi.fn(),
}));

const mockCustomer = {
  id: 'customer-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-1234',
  address: '123 Main St',
  city: 'Springfield',
  state: 'IL',
  zipCode: '62701',
  notes: 'Preferred customer',
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

const renderCustomerDetails = (customerId = 'customer-1') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/customers/${customerId}`]}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('CustomerDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateRepair).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as unknown as ReturnType<typeof useCreateRepair>);
    vi.mocked(useUpdateRepair).mockReturnValue({ mutateAsync: vi.fn(), isPending: false } as unknown as ReturnType<typeof useUpdateRepair>);
    vi.mocked(useDeleteRepair).mockReturnValue({ mutateAsync: vi.fn() } as unknown as ReturnType<typeof useDeleteRepair>);
  });

  it('renders loading state when customer is loading', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: true, data: undefined } as unknown as ReturnType<typeof useCustomer>);
    vi.mocked(useRepairs).mockReturnValue({ isLoading: false, data: undefined } as unknown as ReturnType<typeof useRepairs>);

    renderCustomerDetails();
    expect(screen.getByText(/Loading customer details.../i)).toBeInTheDocument();
  });

  it('renders customer details correctly', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as unknown as ReturnType<typeof useCustomer>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);

    renderCustomerDetails();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('opens RepairForm when Add Repair button is clicked', async () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as unknown as ReturnType<typeof useCustomer>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);

    renderCustomerDetails();

    const addButton = screen.getByRole('button', { name: /Add Repair/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/New Repair/i)).toBeInTheDocument();
  });

  it('calls useCreateRepair when form is submitted', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as unknown as ReturnType<typeof useCustomer>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);
    vi.mocked(useCreateRepair).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false } as unknown as ReturnType<typeof useCreateRepair>);

    renderCustomerDetails();

    fireEvent.click(screen.getByRole('button', { name: /Add Repair/i }));

    // Fill required fields in RepairForm
    fireEvent.change(screen.getByLabelText(/Vehicle/i), { target: { value: 'vehicle-1' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'New Repair' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Create Repair/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
        description: 'New Repair',
        customerId: 'customer-1',
      } as CreateRepairDto));
    });
  });

  it('calls useUpdateRepair when edit form is submitted', async () => {
    const mockMutateAsync = vi.fn().mockResolvedValue({});
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as unknown as ReturnType<typeof useCustomer>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: mockRepairs, pagination: { total: 1, totalPages: 1, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);
    vi.mocked(useUpdateRepair).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false } as unknown as ReturnType<typeof useUpdateRepair>);

    renderCustomerDetails();

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
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as unknown as ReturnType<typeof useCustomer>);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: mockRepairs, pagination: { total: 1, totalPages: 1, currentPage: 1, perPage: 10 } },
    } as unknown as ReturnType<typeof useRepairs>);
    vi.mocked(useDeleteRepair).mockReturnValue({ mutateAsync: mockMutateAsync } as unknown as ReturnType<typeof useDeleteRepair>);

    vi.spyOn(window, 'confirm').mockReturnValue(true);

    renderCustomerDetails();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(window.confirm).toHaveBeenCalled();
    expect(mockMutateAsync).toHaveBeenCalledWith('repair-1');
  });
});