import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sales } from '../../src/pages/Sales';
import { MemoryRouter } from 'react-router-dom';
import {
  useSales,
  useCreateSale,
  useUpdateSale,
  useDeleteSale,
} from '../../src/hooks/useSales';
import { Sale, SaleStatus } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useSales', () => ({
  useSales: vi.fn(),
  useCreateSale: vi.fn(),
  useUpdateSale: vi.fn(),
  useDeleteSale: vi.fn(),
}));

// Mock the SaleForm component
vi.mock('../../src/components/sales/SaleForm', () => ({
  SaleForm: ({ sale, onSubmit, onCancel, isLoading }) => (
    <div data-testid="sale-form">
      <div data-testid="form-sale">{sale ? 'edit' : 'add'}</div>
      <button onClick={() => onSubmit({
        vehicleId: 'vehicle-1',
        customerId: 'customer-1',
        salePrice: 25000,
        saleDate: '2024-01-15',
        status: SaleStatus.COMPLETED,
      })}>
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

// Mock the SaleCard component
vi.mock('../../src/components/sales/SaleCard', () => ({
  SaleCard: ({ sale, onEdit, onDelete }) => (
    <div data-testid="sale-card">
      <div data-testid="sale-info">Sale {sale.id}</div>
      <button onClick={() => onEdit(sale)}>Edit</button>
      <button onClick={() => onDelete(sale)}>Delete</button>
    </div>
  ),
}));

const renderSales = () => {
  return render(
    <MemoryRouter>
      <Sales />
    </MemoryRouter>
  );
};

// Mock sale data
const mockSales: Sale[] = [
  {
    id: '1',
    vehicleId: 'vehicle-1',
    customerId: 'customer-1',
    salePrice: 25000,
    saleDate: '2024-01-15',
    status: SaleStatus.COMPLETED,
    paymentMethod: 'cash',
    notes: 'Sold to regular customer',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'user-1',
  },
  {
    id: '2',
    vehicleId: 'vehicle-2',
    customerId: 'customer-2',
    salePrice: 28000,
    saleDate: '2024-01-20',
    status: SaleStatus.PENDING,
    paymentMethod: 'financing',
    notes: 'Awaiting final paperwork',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    createdBy: 'user-1',
  },
];

describe('Sales Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    vi.mocked(useSales).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    vi.mocked(useCreateSale).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    vi.mocked(useUpdateSale).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    vi.mocked(useDeleteSale).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
  });

  it('renders loading state when data is fetching', () => {
    vi.mocked(useSales).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as never);

    renderSales();
    expect(screen.getByText(/Loading sales.../i)).toBeInTheDocument();
  });

  it('renders empty state when no sales exist', () => {
    vi.mocked(useSales).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderSales();
    expect(screen.getByText(/No sales yet. Create your first sale!/i)).toBeInTheDocument();
  });

  it('renders sales list when sales exist', () => {
    vi.mocked(useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderSales();
    expect(screen.getAllByTestId('sale-card')).toHaveLength(2);
    expect(screen.getByText('Sale 1')).toBeInTheDocument();
    expect(screen.getByText('Sale 2')).toBeInTheDocument();
  });

  it('renders New Sale button', () => {
    renderSales();
    expect(screen.getByText('New Sale')).toBeInTheDocument();
  });

  it('opens Add Sale form when New Sale button is clicked', () => {
    renderSales();
    fireEvent.click(screen.getByText('New Sale'));
    expect(screen.getByTestId('sale-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-sale')).toHaveTextContent('add');
  });

  it('opens Edit Sale form when Edit button is clicked on a sale card', () => {
    vi.mocked(useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderSales();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByTestId('sale-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-sale')).toHaveTextContent('edit');
  });

  it('calls deleteMutation.mutateAsync when Delete button is clicked and confirmed', async () => {
    vi.mocked(useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockDeleteMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteSale).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderSales();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this sale?');
    expect(mockDeleteMutation).toHaveBeenCalledWith('1');
    mockConfirm.mockRestore();
  });

  it('does not call deleteMutation.mutateAsync when Delete button is clicked but cancelled', () => {
    vi.mocked(useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const mockDeleteMutation = vi.fn();
    vi.mocked(useDeleteSale).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderSales();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteMutation).not.toHaveBeenCalled();
    mockConfirm.mockRestore();
  });

  it('calls createMutation.mutateAsync when Add Sale form is submitted', async () => {
    const mockCreateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateSale).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderSales();
    fireEvent.click(screen.getByText('New Sale'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith({
        vehicleId: 'vehicle-1',
        customerId: 'customer-1',
        salePrice: 25000,
        saleDate: '2024-01-15',
        status: SaleStatus.COMPLETED,
      });
    });
  });

  it('calls updateMutation.mutateAsync when Edit Sale form is submitted', async () => {
    vi.mocked(useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const mockUpdateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateSale).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderSales();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: '1',
        data: {
          vehicleId: 'vehicle-1',
          customerId: 'customer-1',
          salePrice: 25000,
          saleDate: '2024-01-15',
          status: SaleStatus.COMPLETED,
        },
      });
    });
  });

  it('handles error when sale creation fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Creation failed');
    const mockCreateMutation = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useCreateSale).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderSales();
    fireEvent.click(screen.getByText('New Sale'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save sale:', mockError);
    });

    consoleSpy.mockRestore();
  });

  it('handles error when sale update fails', async () => {
    vi.mocked(useSales).mockReturnValue({
      data: mockSales,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Update failed');
    const mockUpdateMutation = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useUpdateSale).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderSales();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save sale:', mockError);
    });

    consoleSpy.mockRestore();
  });

  it('closes form when Cancel button is clicked', () => {
    renderSales();
    fireEvent.click(screen.getByText('New Sale'));
    expect(screen.getByTestId('sale-form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('sale-form')).not.toBeInTheDocument();
  });
});
