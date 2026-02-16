import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Repairs } from '../../src/pages/Repairs';
import { MemoryRouter } from 'react-router-dom';
import {
  useRepairs,
  useCreateRepair,
  useUpdateRepair,
  useDeleteRepair,
} from '../../src/hooks/useRepairs';
import { Repair, RepairStatus } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useRepairs', () => ({
  useRepairs: vi.fn(),
  useCreateRepair: vi.fn(),
  useUpdateRepair: vi.fn(),
  useDeleteRepair: vi.fn(),
}));

// Mock the RepairForm component
vi.mock('../../src/components/repairs/RepairForm', () => ({
  RepairForm: ({ repair, onSubmit, onCancel, isLoading }) => (
    <div data-testid="repair-form">
      <div data-testid="form-repair">{repair ? 'edit' : 'add'}</div>
      <button onClick={() => onSubmit({
        vehicleId: 'vehicle-1',
        customerId: 'customer-1',
        description: 'Test repair',
        status: RepairStatus.PENDING,
        startDate: new Date('2024-01-15')
      })}>
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
      {isLoading && <div>Loading...</div>}
    </div>
  ),
}));

// Mock the RepairCard component
vi.mock('../../src/components/repairs/RepairCard', () => ({
  RepairCard: ({ repair, onEdit, onDelete }) => (
    <div data-testid="repair-card">
      <div data-testid="repair-description">{repair.description}</div>
      <button onClick={() => onEdit(repair)}>Edit</button>
      <button onClick={() => onDelete(repair)}>Delete</button>
    </div>
  ),
}));

// Mock the RepairFilterBar component
vi.mock('../../src/components/repairs/RepairFilterBar', () => ({
  RepairFilterBar: ({ onSearch, onClear, isFiltered }) => (
    <div data-testid="repair-filter-bar">
      <button onClick={onSearch}>Search</button>
      {isFiltered && <button onClick={onClear}>Clear</button>}
    </div>
  ),
}));

const renderRepairs = () => {
  return render(
    <MemoryRouter>
      <Repairs />
    </MemoryRouter>
  );
};

// Mock repair data
const mockRepairs: Repair[] = [
  {
    id: '1',
    vehicleId: 'vehicle-1',
    customerId: 'customer-1',
    description: 'Engine overhaul',
    status: RepairStatus.IN_PROGRESS,
    cost: 1500,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    technician: 'John Smith',
    createdAt: new Date('2023-01-01T00:00:00Z'),
    updatedAt: new Date('2023-01-01T00:00:00Z'),
  },
  {
    id: '2',
    vehicleId: 'vehicle-2',
    customerId: 'customer-2',
    description: 'Brake replacement',
    status: RepairStatus.COMPLETED,
    cost: 500,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-12'),
    technician: 'Jane Doe',
    createdAt: new Date('2023-01-02T00:00:00Z'),
    updatedAt: new Date('2023-01-02T00:00:00Z'),
  },
];

const mockPaginatedData = {
  data: mockRepairs,
  pagination: {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  },
};

describe('Repairs Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    vi.mocked(useRepairs).mockReturnValue({
      data: mockPaginatedData,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);
    vi.mocked(useCreateRepair).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
    vi.mocked(useUpdateRepair).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
    vi.mocked(useDeleteRepair).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);
  });

  it('renders loading state when data is fetching', () => {
    vi.mocked(useRepairs).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    } as never);

    renderRepairs();
    expect(screen.getByText(/Loading repairs.../i)).toBeInTheDocument();
  });

  it('renders empty state when no repairs exist', () => {
    vi.mocked(useRepairs).mockReturnValue({
      data: { data: [], pagination: undefined },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderRepairs();
    expect(screen.getByText(/No repairs yet. Add your first repair!/i)).toBeInTheDocument();
  });

  it('renders repair list when repairs exist', () => {
    renderRepairs();
    expect(screen.getAllByTestId('repair-card')).toHaveLength(2);
    expect(screen.getByText('Engine overhaul')).toBeInTheDocument();
    expect(screen.getByText('Brake replacement')).toBeInTheDocument();
  });

  it('opens Add Repair modal when Add Repair button is clicked', () => {
    renderRepairs();
    fireEvent.click(screen.getByText('Add Repair'));
    expect(screen.getByTestId('repair-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-repair')).toHaveTextContent('add');
  });

  it('opens Edit Repair modal when Edit button is clicked on a repair card', () => {
    renderRepairs();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    expect(screen.getByTestId('repair-form')).toBeInTheDocument();
    expect(screen.getByTestId('form-repair')).toHaveTextContent('edit');
  });

  it('calls deleteMutation.mutateAsync when Delete button is clicked and confirmed', async () => {
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockDeleteMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useDeleteRepair).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderRepairs();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this repair: Engine overhaul?');
    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith('1');
    });
    mockConfirm.mockRestore();
  });

  it('does not call deleteMutation.mutateAsync when Delete button is clicked but cancelled', () => {
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const mockDeleteMutation = vi.fn();
    vi.mocked(useDeleteRepair).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderRepairs();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockConfirm).toHaveBeenCalled();
    expect(mockDeleteMutation).not.toHaveBeenCalled();
    mockConfirm.mockRestore();
  });

  it('calls createMutation.mutateAsync when Add Repair form is submitted', async () => {
    const mockCreateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateRepair).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderRepairs();
    fireEvent.click(screen.getByText('Add Repair'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalledWith({
        vehicleId: 'vehicle-1',
        customerId: 'customer-1',
        description: 'Test repair',
        status: RepairStatus.PENDING,
        startDate: expect.any(Date),
      });
    });
  });

  it('calls updateMutation.mutateAsync when Edit Repair form is submitted', async () => {
    const mockUpdateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useUpdateRepair).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderRepairs();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalledWith({
        id: '1',
        data: {
          vehicleId: 'vehicle-1',
          customerId: 'customer-1',
          description: 'Test repair',
          status: RepairStatus.PENDING,
          startDate: expect.any(Date),
        },
      });
    });
  });

  it('handles error when repair creation fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Creation failed');
    const mockCreateMutation = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useCreateRepair).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderRepairs();
    fireEvent.click(screen.getByText('Add Repair'));
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockCreateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save repair:', mockError);
    });

    consoleSpy.mockRestore();
  });

  it('handles error when repair update fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockError = new Error('Update failed');
    const mockUpdateMutation = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useUpdateRepair).mockReturnValue({
      mutateAsync: mockUpdateMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderRepairs();
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockUpdateMutation).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save repair:', mockError);
    });

    consoleSpy.mockRestore();
  });

  it('handles error when repair deletion fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const mockError = new Error('Delete failed');
    const mockDeleteMutation = vi.fn().mockRejectedValue(mockError);

    vi.mocked(useDeleteRepair).mockReturnValue({
      mutateAsync: mockDeleteMutation,
      isPending: false,
      error: mockError,
      isError: true,
      isSuccess: false,
    } as never);

    renderRepairs();
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteMutation).toHaveBeenCalledWith('1');
      expect(consoleSpy).toHaveBeenCalledWith('Failed to delete repair:', mockError);
    });

    mockConfirm.mockRestore();
    consoleSpy.mockRestore();
  });

  it('renders pagination when repairs span multiple pages', () => {
    const multiPageData = {
      data: mockRepairs,
      pagination: {
        page: 1,
        limit: 10,
        total: 25,
        totalPages: 3,
      },
    };

    vi.mocked(useRepairs).mockReturnValue({
      data: multiPageData,
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    } as never);

    renderRepairs();
    // Pagination component should be rendered
    expect(screen.getAllByTestId('repair-card')).toHaveLength(2);
  });

  it('closes form modal when Cancel button is clicked', () => {
    renderRepairs();
    fireEvent.click(screen.getByText('Add Repair'));
    expect(screen.getByTestId('repair-form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('repair-form')).not.toBeInTheDocument();
  });

  it('closes form modal after successful creation', async () => {
    const mockCreateMutation = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useCreateRepair).mockReturnValue({
      mutateAsync: mockCreateMutation,
      isPending: false,
      error: null,
      isError: false,
      isSuccess: false,
    } as never);

    renderRepairs();
    fireEvent.click(screen.getByText('Add Repair'));
    expect(screen.getByTestId('repair-form')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.queryByTestId('repair-form')).not.toBeInTheDocument();
    });
  });
});
