import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerDetails } from '../../src/pages/CustomerDetails';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useCustomer } from '../../src/hooks/useCustomers';
import { useRepairs } from '../../src/hooks/useRepairs';
import { RepairStatus } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useCustomers', () => ({
  useCustomer: vi.fn(),
}));

vi.mock('../../src/hooks/useRepairs', () => ({
  useRepairs: vi.fn(),
  useCreateRepair: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useUpdateRepair: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useDeleteRepair: vi.fn(() => ({ mutateAsync: vi.fn() })),
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
  {
    id: 'repair-2',
    vehicleId: 'vehicle-2',
    customerId: 'customer-1',
    description: 'Transmission service',
    status: RepairStatus.COMPLETED,
    cost: 450,
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-03'),
    technician: 'Jane Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const renderCustomerDetails = (customerId = 'customer-1') => {
  return render(
    <MemoryRouter initialEntries={[`/customers/${customerId}`]}>
      <Routes>
        <Route path="/customers/:id" element={<CustomerDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('CustomerDetails Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when customer is loading', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: true, data: undefined } as never);
    vi.mocked(useRepairs).mockReturnValue({ isLoading: false, data: undefined } as never);

    renderCustomerDetails();
    expect(screen.getByText(/Loading customer details.../i)).toBeInTheDocument();
  });

  it('renders customer not found message when customer does not exist', async () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: undefined } as never);
    vi.mocked(useRepairs).mockReturnValue({ isLoading: false, data: undefined } as never);

    renderCustomerDetails();
    await waitFor(() => {
      expect(screen.getByText(/Customer not found/i)).toBeInTheDocument();
    });
  });

  it('renders customer details correctly', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderCustomerDetails();

    // Check customer information
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Springfield, IL')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('ZIP: 62701')).toBeInTheDocument();
    expect(screen.getByText('Preferred customer')).toBeInTheDocument();
  });

  it('displays service history correctly when repairs exist', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: mockRepairs, pagination: { total: 2, totalPages: 1, currentPage: 1, perPage: 10 } },
    } as never);

    renderCustomerDetails();

    // Check service history section
    expect(screen.getByText('Service History')).toBeInTheDocument();
    expect(screen.getByText('Oil change and tire rotation')).toBeInTheDocument();
    expect(screen.getByText('Transmission service')).toBeInTheDocument();
    expect(screen.getByText('Technician: John Smith')).toBeInTheDocument();
    expect(screen.getByText('Technician: Jane Doe')).toBeInTheDocument();
  });

  it('displays empty state when no repairs exist', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderCustomerDetails();

    expect(screen.getByText(/No service history for this customer yet/i)).toBeInTheDocument();
  });

  it('filters repairs by customerId', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderCustomerDetails('customer-1');

    // Verify that useRepairs was called with the correct customerId filter
    expect(useRepairs).toHaveBeenCalledWith({ customerId: 'customer-1' });
  });

  it('renders Add Repair button', () => {
    vi.mocked(useCustomer).mockReturnValue({ isLoading: false, data: mockCustomer } as never);
    vi.mocked(useRepairs).mockReturnValue({
      isLoading: false,
      data: { data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, perPage: 10 } },
    } as never);

    renderCustomerDetails();

    expect(screen.getByRole('button', { name: /Add Repair/i })).toBeInTheDocument();
  });
});
