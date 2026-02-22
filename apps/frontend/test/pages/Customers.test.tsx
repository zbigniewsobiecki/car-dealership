import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Customers } from '../../src/pages/Customers';
import { MemoryRouter } from 'react-router-dom';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '../../src/hooks/useCustomers';
import { Customer } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useCustomers', () => ({
  useCustomers: vi.fn(),
  useCreateCustomer: vi.fn(),
  useUpdateCustomer: vi.fn(),
  useDeleteCustomer: vi.fn(),
}));

// Mock the CustomerForm component
vi.mock('../../src/components/customers/CustomerForm', () => ({
  CustomerForm: ({ customer, onSubmit, onCancel, isLoading }) => (
    <div data-testid="customer-form">
      <div data-testid="form-customer">{customer ? 'edit' : 'add'}</div>
      <button onClick={() => onSubmit({ firstName: 'John', lastName: 'Doe' })}>
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

// Mock the CustomerCard component
vi.mock('../../src/components/customers/CustomerCard', () => ({
  CustomerCard: ({ customer, onEdit, onDelete }) => (
    <div data-testid="customer-card">
      <div data-testid="customer-name">{customer.firstName} {customer.lastName}</div>
      <button onClick={() => onEdit(customer)}>Edit</button>
      <button onClick={() => onDelete(customer)}>Delete</button>
    </div>
  ),
}));

const renderCustomers = () => {
  return render(
    <MemoryRouter>
      <Customers />
    </MemoryRouter>
  );
};

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-1234',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    notes: 'Test customer 1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-5678',
    address: '456 Oak Ave',
    city: 'Shelbyville',
    state: 'IL',
    zipCode: '62702',
    notes: 'Test customer 2',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

describe('Customers Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(useCustomers).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);
    vi.mocked(useCreateCustomer).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
    vi.mocked(useUpdateCustomer).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
    vi.mocked(useDeleteCustomer).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
  });

  it('renders loading state when data is fetching', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as never);

    renderCustomers();
    expect(screen.getByText(/Loading customers.../i)).toBeInTheDocument();
  });

  it('renders empty state when no customers exist', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderCustomers();
    expect(screen.getByText(/No customers yet. Add your first customer!/i)).toBeInTheDocument();
  });

  it('renders customer list when customers exist', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderCustomers();
    expect(screen.getAllByTestId('customer-card')).toHaveLength(2);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('opens Add Customer modal when Add Customer button is clicked', () => {
    renderCustomers();
    fireEvent.click(screen.getByText('Add Customer'));
    expect(screen.getByTestId('customer-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-customer')).toHaveTextContent('add');
  });

  it('opens Edit Customer modal when Edit button is clicked on a customer card', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderCustomers();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByTestId('customer-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-customer')).toHaveTextContent('edit');
  });

  it('calls deleteMutation.mutateAsync when Delete button is clicked and confirmed', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockDeleteMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteCustomer).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderCustomers();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete John Doe?');
    expect(mockDeleteMutation).toHaveBeenCalledWith('1');
    mockConfirm.mockRestore();
  });

  it('does not call deleteMutation.mutateAsync when Delete button is clicked but cancelled', () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const mockDeleteMutation = vi.fn();
    vi.mocked(useDeleteCustomer).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderCustomers();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteMutation).not.toHaveBeenCalled();
    mockConfirm.mockRestore();
  });

  it('calls createMutation.mutateAsync when Add Customer form is submitted', async () => {
    const mockCreateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateCustomer).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderCustomers();
    fireEvent.click(screen.getByText('Add Customer'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  it('calls updateMutation.mutateAsync when Edit Customer form is submitted', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockUpdateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateCustomer).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderCustomers();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: '1',
        data: { firstName: 'John', lastName: 'Doe' },
      });
    });
  });

  it('handles error when customer creation fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Creation failed');
    const mockCreateMutation = vi.fn().mockRejectedValue(mockError);
    
    vi.mocked(useCreateCustomer).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderCustomers();
    fireEvent.click(screen.getByText('Add Customer'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save customer:', mockError);
    });
    
    consoleSpy.mockRestore();
  });

  it('handles error when customer update fails', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Update failed');
    const mockUpdateMutation = vi.fn().mockRejectedValue(mockError);
    
    vi.mocked(useUpdateCustomer).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderCustomers();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save customer:', mockError);
    });
    
    consoleSpy.mockRestore();
  });

  it('handles error when customer deletion fails', async () => {
    vi.mocked(useCustomers).mockReturnValue({
      data: mockCustomers,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockError = new Error('Delete failed');
    const mockDeleteMutation = vi.fn().mockRejectedValue(mockError);
    
    vi.mocked(useDeleteCustomer).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderCustomers();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith('1');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to delete customer:', mockError);
    });
    
    mockConfirm.mockRestore();
    consoleSpy.mockRestore();
  });
});