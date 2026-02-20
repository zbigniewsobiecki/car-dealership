import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RepairFilterBar } from '../../src/components/repairs/RepairFilterBar';
import { RepairStatus } from '@car-dealership/shared-types';

describe('RepairFilterBar', () => {
  const mockProps = {
    status: '',
    onStatusChange: vi.fn(),
    technician: '',
    onTechnicianChange: vi.fn(),
    onSearch: vi.fn(),
    onClear: vi.fn(),
    isFiltered: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders technician search input with placeholder', () => {
    render(<RepairFilterBar {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search by technician name...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders status select with all options', () => {
    render(<RepairFilterBar {...mockProps} />);
    const statusSelect = screen.getByRole('combobox');
    expect(statusSelect).toBeInTheDocument();
    expect(screen.getByText('All Statuses')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('renders Search button', () => {
    render(<RepairFilterBar {...mockProps} />);
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('does not render Clear button when not filtered', () => {
    render(<RepairFilterBar {...mockProps} isFiltered={false} />);
    expect(screen.queryByRole('button', { name: /Clear/i })).not.toBeInTheDocument();
  });

  it('renders Clear button when filtered', () => {
    render(<RepairFilterBar {...mockProps} isFiltered={true} />);
    expect(screen.getByRole('button', { name: /Clear/i })).toBeInTheDocument();
  });

  it('calls onTechnicianChange when technician input changes', () => {
    render(<RepairFilterBar {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search by technician name...');
    fireEvent.change(searchInput, { target: { value: 'John Doe' } });
    expect(mockProps.onTechnicianChange).toHaveBeenCalledWith('John Doe');
  });

  it('calls onStatusChange when status select changes', () => {
    render(<RepairFilterBar {...mockProps} />);
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: RepairStatus.IN_PROGRESS } });
    expect(mockProps.onStatusChange).toHaveBeenCalledWith(RepairStatus.IN_PROGRESS);
  });

  it('calls onSearch when Search button is clicked', () => {
    render(<RepairFilterBar {...mockProps} />);
    const searchButton = screen.getByRole('button', { name: /Search/i });
    fireEvent.click(searchButton);
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('calls onSearch when form is submitted', () => {
    render(<RepairFilterBar {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search by technician name...');
    fireEvent.submit(searchInput.closest('form')!);
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('calls onClear when Clear button is clicked', () => {
    render(<RepairFilterBar {...mockProps} isFiltered={true} />);
    const clearButton = screen.getByRole('button', { name: /Clear/i });
    fireEvent.click(clearButton);
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('displays current technician value', () => {
    render(<RepairFilterBar {...mockProps} technician="Jane Smith" />);
    const searchInput = screen.getByPlaceholderText('Search by technician name...') as HTMLInputElement;
    expect(searchInput.value).toBe('Jane Smith');
  });

  it('displays current status value', () => {
    render(<RepairFilterBar {...mockProps} status={RepairStatus.COMPLETED} />);
    const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(statusSelect.value).toBe(RepairStatus.COMPLETED);
  });
});