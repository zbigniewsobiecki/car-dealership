import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VehicleForm } from '../../src/components/vehicles/VehicleForm';
import { 
  Vehicle, 
  VehicleStatus, 
  VehicleCondition 
} from '@car-dealership/shared-types';

describe('VehicleForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const mockVehicle: Vehicle = {
    id: 'veh-1',
    vin: '1HGCM82633A123456',
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    color: 'Silver',
    mileage: 15000,
    price: 28500,
    cost: 25000,
    status: VehicleStatus.AVAILABLE,
    condition: VehicleCondition.USED,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyType: 'Sedan',
    engine: '2.0L I4',
    description: 'Excellent condition',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields in create mode', () => {
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Add New Vehicle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1HGCM82633A123456')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Honda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Accord')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('2023')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Silver')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('15000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('28500.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Vehicle/i })).toBeInTheDocument();
  });

  it('should render in edit mode with pre-populated values', () => {
    render(
      <VehicleForm
        vehicle={mockVehicle}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Vehicle')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('1HGCM82633A123456')).toHaveValue(mockVehicle.vin);
    expect(screen.getByPlaceholderText('Honda')).toHaveValue(mockVehicle.make);
    expect(screen.getByPlaceholderText('Accord')).toHaveValue(mockVehicle.model);
    expect(screen.getByPlaceholderText('2023')).toHaveValue(mockVehicle.year);
    expect(screen.getByPlaceholderText('Silver')).toHaveValue(mockVehicle.color);
    expect(screen.getByPlaceholderText('15000')).toHaveValue(mockVehicle.mileage);
    expect(screen.getByPlaceholderText('28500.00')).toHaveValue(mockVehicle.price);
    expect(screen.getByRole('button', { name: /Update Vehicle/i })).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Add Vehicle/i }));

    expect(await screen.findByText('VIN is required')).toBeInTheDocument();
    expect(await screen.findByText('Make is required')).toBeInTheDocument();
    expect(await screen.findByText('Model is required')).toBeInTheDocument();
    expect(await screen.findByText('Year is required')).toBeInTheDocument();
    expect(await screen.findByText('Color is required')).toBeInTheDocument();
    expect(await screen.findByText('Price is required')).toBeInTheDocument();
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid year range', async () => {
    const user = userEvent.setup();
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const yearInput = screen.getByPlaceholderText('2023');
    
    // Test year too low
    await user.clear(yearInput);
    await user.type(yearInput, '1899');
    fireEvent.click(screen.getByRole('button', { name: /Add Vehicle/i }));
    expect(await screen.findByText('Invalid year')).toBeInTheDocument();

    // Test year too high
    await user.clear(yearInput);
    await user.type(yearInput, '2101');
    fireEvent.click(screen.getByRole('button', { name: /Add Vehicle/i }));
    expect(await screen.findByText('Invalid year')).toBeInTheDocument();
  });

  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByPlaceholderText('1HGCM82633A123456'), 'VIN123');
    await user.type(screen.getByPlaceholderText('Honda'), 'Toyota');
    await user.type(screen.getByPlaceholderText('Accord'), 'Camry');
    await user.type(screen.getByPlaceholderText('2023'), '2022');
    await user.type(screen.getByPlaceholderText('Silver'), 'Blue');
    await user.type(screen.getByPlaceholderText('28500.00'), '30000');

    await user.click(screen.getByRole('button', { name: /Add Vehicle/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        vin: 'VIN123',
        make: 'Toyota',
        model: 'Camry',
        year: '2022', // HTML input type="number" often returns string in react-hook-form unless valueAsNumber is used
        color: 'Blue',
        price: 30000,
      }),
      expect.anything()
    );
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when close icon is clicked', () => {
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // The close button is the first button in the header
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button and show loading state', () => {
    render(
      <VehicleForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Saving.../i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});