import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CustomerCard } from '../../src/components/customers/CustomerCard';

describe('CustomerCard', () => {
  const mockCustomer = {
    id: 'customer-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '555-1234',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '90210',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render customer information', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
  });

  it('should render location when city and state provided', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Anytown, CA')).toBeInTheDocument();
  });

  it('should call onEdit when Edit button is clicked', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockOnEdit).toHaveBeenCalledWith(mockCustomer);
  });

  it('should call onDelete when Delete button is clicked', () => {
    render(
      <CustomerCard
        customer={mockCustomer}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(mockCustomer);
  });
});
