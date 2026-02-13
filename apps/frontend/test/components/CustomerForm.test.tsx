import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomerForm } from '../../src/components/customers/CustomerForm';
import { Customer } from '@car-dealership/shared-types';

describe('CustomerForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const mockCustomer: Customer = {
    id: 'cust-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-0123',
    address: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    notes: 'Regular customer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields in create mode', () => {
    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Add New Customer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('555-0123')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('123 Main St')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Springfield')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('IL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('62701')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Additional notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Customer/i })).toBeInTheDocument();
  });

  it('should render in edit mode with pre-populated values', () => {
    render(
      <CustomerForm
        customer={mockCustomer}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Edit Customer')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John')).toHaveValue(mockCustomer.firstName);
    expect(screen.getByPlaceholderText('Doe')).toHaveValue(mockCustomer.lastName);
    expect(screen.getByPlaceholderText('john.doe@example.com')).toHaveValue(mockCustomer.email);
    expect(screen.getByPlaceholderText('555-0123')).toHaveValue(mockCustomer.phone);
    expect(screen.getByPlaceholderText('123 Main St')).toHaveValue(mockCustomer.address);
    expect(screen.getByPlaceholderText('Springfield')).toHaveValue(mockCustomer.city);
    expect(screen.getByPlaceholderText('IL')).toHaveValue(mockCustomer.state);
    expect(screen.getByPlaceholderText('62701')).toHaveValue(mockCustomer.zipCode);
    expect(screen.getByPlaceholderText(/Additional notes/i)).toHaveValue(mockCustomer.notes);
    expect(screen.getByRole('button', { name: /Update Customer/i })).toBeInTheDocument();
  });

  it('should show validation errors for required fields', async () => {
    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Add Customer/i }));

    expect(await screen.findByText('First name is required')).toBeInTheDocument();
    expect(await screen.findByText('Last name is required')).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when close icon is clicked', () => {
    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    // The close button contains the X icon
    const closeButton = screen.getByRole('button', { name: '' }); // The X button doesn't have a name, but it's the first button
    fireEvent.click(closeButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should disable submit button and show loading state', () => {
    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Saving.../i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    // Mock onSubmit to prevent actual form submission side effects if any
    mockOnSubmit.mockImplementation((e) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
    });

    render(
      <CustomerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    await user.type(screen.getByPlaceholderText('John'), 'Jane');
    await user.type(screen.getByPlaceholderText('Doe'), 'Smith');
    await user.type(screen.getByPlaceholderText('john.doe@example.com'), 'jane.smith@example.com');

    const submitButton = screen.getByRole('button', { name: /Add Customer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    // React Hook Form's handleSubmit passes the data as the first argument
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      }),
      expect.anything() // event object
    );
  });
});