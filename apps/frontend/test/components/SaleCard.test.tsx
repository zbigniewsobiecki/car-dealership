import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SaleCard } from '../../src/components/sales/SaleCard';
import { SaleStatus } from '@car-dealership/shared-types';

describe('SaleCard', () => {
  const mockSale = {
    id: 'sale-1234567890',
    vehicleId: 'vehicle-1',
    customerId: 'customer-1',
    salespersonId: 'user-1',
    salePrice: 25000,
    saleDate: new Date('2024-01-15'),
    status: SaleStatus.PENDING,
    paymentMethod: 'cash',
    downPayment: 5000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render sale information', () => {
    render(
      <SaleCard
        sale={mockSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText(/Sale #sale-123/)).toBeInTheDocument();
  });

  it('should render payment method when provided', () => {
    render(
      <SaleCard
        sale={mockSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('cash')).toBeInTheDocument();
  });

  it('should render down payment when provided', () => {
    render(
      <SaleCard
        sale={mockSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('$5,000')).toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    render(
      <SaleCard
        sale={mockSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockSale);
  });

  it('should call onDelete when Delete button is clicked', () => {
    render(
      <SaleCard
        sale={mockSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockSale);
  });

  it('should render different status colors', () => {
    const completedSale = { ...mockSale, status: SaleStatus.COMPLETED };

    render(
      <SaleCard
        sale={completedSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('should not render payment details when not provided', () => {
    const simpleSale = {
      ...mockSale,
      paymentMethod: undefined,
      downPayment: undefined,
    };

    render(
      <SaleCard
        sale={simpleSale}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.queryByText('Payment Method')).not.toBeInTheDocument();
  });
});
