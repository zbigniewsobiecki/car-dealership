import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleCard } from '../../src/components/vehicles/VehicleCard';
import { VehicleStatus, VehicleCondition } from '@car-dealership/shared-types';

describe('VehicleCard', () => {
  const mockVehicle = {
    id: 'vehicle-1',
    vin: 'ABC123456789',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: 'Blue',
    mileage: 15000,
    price: 25000,
    status: VehicleStatus.AVAILABLE,
    condition: VehicleCondition.USED,
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render vehicle information', () => {
    render(
      <VehicleCard
        vehicle={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('VIN: ABC123456789')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('15,000 mi')).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();
  });

  it('should render condition, transmission, and fuel type badges', () => {
    render(
      <VehicleCard
        vehicle={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('used')).toBeInTheDocument();
    expect(screen.getByText('Automatic')).toBeInTheDocument();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    render(
      <VehicleCard
        vehicle={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockVehicle);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete when Delete button is clicked', () => {
    render(
      <VehicleCard
        vehicle={mockVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockVehicle);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should render different status colors', () => {
    const soldVehicle = { ...mockVehicle, status: VehicleStatus.SOLD };

    render(
      <VehicleCard
        vehicle={soldVehicle}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('sold')).toBeInTheDocument();
  });

  it('should not render mileage when not provided', () => {
    const vehicleWithoutMileage = { ...mockVehicle, mileage: undefined };

    render(
      <VehicleCard
        vehicle={vehicleWithoutMileage}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText(/mi$/)).not.toBeInTheDocument();
  });
});
