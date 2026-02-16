import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RepairCard } from '../../src/components/repairs/RepairCard';
import { RepairStatus } from '@car-dealership/shared-types';

describe('RepairCard', () => {
  const mockRepair = {
    id: 'repair-1',
    vehicleId: 'vehicle-1',
    customerId: 'customer-1',
    description: 'Engine overhaul',
    status: RepairStatus.IN_PROGRESS,
    cost: 1500,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-20'),
    technician: 'John Smith',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render repair information', () => {
    render(
      <RepairCard
        repair={mockRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Engine overhaul')).toBeInTheDocument();
    expect(screen.getByText('Technician: John Smith')).toBeInTheDocument();
    expect(screen.getByText('in progress')).toBeInTheDocument();
  });

  it('should render formatted dates', () => {
    render(
      <RepairCard
        repair={mockRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
    expect(screen.getByText('1/20/2024')).toBeInTheDocument();
  });

  it('should render formatted cost', () => {
    render(
      <RepairCard
        repair={mockRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$1,500.00')).toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    render(
      <RepairCard
        repair={mockRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockRepair);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when Delete button is clicked', () => {
    render(
      <RepairCard
        repair={mockRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockRepair);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should not render technician when not provided', () => {
    const repairWithoutTechnician = { ...mockRepair, technician: undefined };

    render(
      <RepairCard
        repair={repairWithoutTechnician}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/Technician:/)).not.toBeInTheDocument();
  });

  it('should not render endDate when not provided', () => {
    const repairWithoutEndDate = { ...mockRepair, endDate: undefined };

    render(
      <RepairCard
        repair={repairWithoutEndDate}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Should have only one date displayed (start date)
    expect(screen.getByText('1/15/2024')).toBeInTheDocument();
    expect(screen.queryByText('1/20/2024')).not.toBeInTheDocument();
    expect(screen.queryByText('End Date')).not.toBeInTheDocument();
  });

  it('should not render cost when not provided', () => {
    const repairWithoutCost = { ...mockRepair, cost: undefined };

    render(
      <RepairCard
        repair={repairWithoutCost}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/\$/)).not.toBeInTheDocument();
    expect(screen.queryByText('Cost')).not.toBeInTheDocument();
  });

  it('should render different status colors for pending', () => {
    const pendingRepair = { ...mockRepair, status: RepairStatus.PENDING };

    render(
      <RepairCard
        repair={pendingRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('pending')).toBeInTheDocument();
  });

  it('should render different status colors for completed', () => {
    const completedRepair = { ...mockRepair, status: RepairStatus.COMPLETED };

    render(
      <RepairCard
        repair={completedRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should render different status colors for cancelled', () => {
    const cancelledRepair = { ...mockRepair, status: RepairStatus.CANCELLED };

    render(
      <RepairCard
        repair={cancelledRepair}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('cancelled')).toBeInTheDocument();
  });
});
