import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RepairForm } from '../../src/components/repairs/RepairForm';
import { RepairStatus, Repair, VehicleStatus } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useVehicles', () => ({
  useVehicles: vi.fn(() => ({
    data: {
      data: [
        { id: 'v-1', make: 'Toyota', model: 'Camry', year: 2022, price: 25000, status: VehicleStatus.AVAILABLE },
        { id: 'v-2', make: 'Honda', model: 'Civic', year: 2021, price: 22000, status: VehicleStatus.AVAILABLE },
        { id: 'v-3', make: 'Ford', model: 'F-150', year: 2023, price: 45000, status: VehicleStatus.SOLD },
      ]
    }
  }))
}));

vi.mock('../../src/hooks/useCustomers', () => ({
  useCustomers: vi.fn(() => ({
    data: [
      { id: 'c-1', firstName: 'John', lastName: 'Doe' },
      { id: 'c-2', firstName: 'Jane', lastName: 'Smith' },
    ]
  }))
}));

describe('RepairForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const mockRepair: Repair = {
    id: 'r-1',
    vehicleId: 'v-1',
    customerId: 'c-1',
    description: 'Engine overhaul',
    status: RepairStatus.IN_PROGRESS,
    cost: 1500,
    startDate: new Date('2023-01-15'),
    endDate: new Date('2023-01-20'),
    technician: 'John Smith',
    notes: 'Customer approved',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields in create mode', () => {
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('New Repair')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Vehicle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Customer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Cost/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^End Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Technician/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Repair/i })).toBeInTheDocument();
  });

  it('should populate dropdowns with mocked data', () => {
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('2021 Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('2023 Ford F-150')).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should render in edit mode with pre-populated values', () => {
    render(
      <RepairForm
        repair={mockRepair}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Repair')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Vehicle/i)).toHaveValue(mockRepair.vehicleId);
    expect(screen.getByLabelText(/^Customer/i)).toHaveValue(mockRepair.customerId);
    expect(screen.getByLabelText(/^Description/i)).toHaveValue(mockRepair.description);
    expect(screen.getByLabelText(/^Status/i)).toHaveValue(mockRepair.status);
    expect(screen.getByLabelText(/^Cost/i)).toHaveValue(mockRepair.cost);
    expect(screen.getByLabelText(/^Start Date/i)).toHaveValue('2023-01-15');
    expect(screen.getByLabelText(/^End Date/i)).toHaveValue('2023-01-20');
    expect(screen.getByLabelText(/^Technician/i)).toHaveValue(mockRepair.technician);
    expect(screen.getByLabelText(/^Notes/i)).toHaveValue(mockRepair.notes);
    expect(screen.getByRole('button', { name: /Update Repair/i })).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Create Repair/i }));

    const errorMessages = await screen.findAllByText(/is required/i);
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when close icon is clicked', () => {
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const closeButton = screen.getAllByRole('button')[0]; // The X button
    fireEvent.click(closeButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onSubmit with correctly formatted payload', async () => {
    const user = userEvent.setup();
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.selectOptions(screen.getByLabelText(/^Vehicle/i), 'v-2');
    await user.selectOptions(screen.getByLabelText(/^Customer/i), 'c-2');
    await user.type(screen.getByLabelText(/^Description/i), 'Brake replacement');

    // Date is pre-filled with today, but let's set a specific one
    fireEvent.change(screen.getByLabelText(/^Start Date/i), { target: { value: '2023-05-20' } });

    await user.click(screen.getByRole('button', { name: /Create Repair/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleId: 'v-2',
        customerId: 'c-2',
        description: 'Brake replacement',
        status: RepairStatus.PENDING,
        startDate: expect.any(Date),
      })
    );

    const submittedStartDate = mockOnSubmit.mock.calls[0][0].startDate;
    expect(submittedStartDate.toISOString()).toContain('2023-05-20');
  });

  it('should handle optional fields correctly', async () => {
    const user = userEvent.setup();
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.selectOptions(screen.getByLabelText(/^Vehicle/i), 'v-1');
    await user.selectOptions(screen.getByLabelText(/^Customer/i), 'c-1');
    await user.type(screen.getByLabelText(/^Description/i), 'Oil change');
    await user.type(screen.getByLabelText(/^Cost/i), '75.50');
    await user.type(screen.getByLabelText(/^Technician/i), 'Bob Johnson');
    await user.type(screen.getByLabelText(/^Notes/i), 'Quick service');

    fireEvent.change(screen.getByLabelText(/^Start Date/i), { target: { value: '2023-06-01' } });
    fireEvent.change(screen.getByLabelText(/^End Date/i), { target: { value: '2023-06-02' } });

    await user.click(screen.getByRole('button', { name: /Create Repair/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        vehicleId: 'v-1',
        customerId: 'c-1',
        description: 'Oil change',
        cost: 75.50,
        technician: 'Bob Johnson',
        notes: 'Quick service',
        startDate: expect.any(Date),
        endDate: expect.any(Date),
      })
    );

    const submittedData = mockOnSubmit.mock.calls[0][0];
    expect(submittedData.startDate.toISOString()).toContain('2023-06-01');
    expect(submittedData.endDate.toISOString()).toContain('2023-06-02');
  });

  it('should handle different repair statuses', async () => {
    const user = userEvent.setup();
    render(
      <RepairForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.selectOptions(screen.getByLabelText(/^Vehicle/i), 'v-1');
    await user.selectOptions(screen.getByLabelText(/^Customer/i), 'c-1');
    await user.type(screen.getByLabelText(/^Description/i), 'Test repair');
    await user.selectOptions(screen.getByLabelText(/^Status/i), RepairStatus.COMPLETED);

    await user.click(screen.getByRole('button', { name: /Create Repair/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        status: RepairStatus.COMPLETED,
      })
    );
  });

  it('should handle edit mode without endDate', () => {
    const repairWithoutEndDate = { ...mockRepair, endDate: undefined };

    render(
      <RepairForm
        repair={repairWithoutEndDate}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByLabelText(/^End Date/i)).toHaveValue('');
  });
});
