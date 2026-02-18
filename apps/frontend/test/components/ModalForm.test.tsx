import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ModalForm } from '../../src/components/shared/ModalForm';

describe('ModalForm', () => {
  const mockOnCancel = vi.fn();
  const mockOnSubmit = vi.fn((e) => e.preventDefault());
  const defaultProps = {
    title: 'Test Modal',
    onCancel: mockOnCancel,
    onSubmit: mockOnSubmit,
    submitLabel: 'Submit',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title and children', () => {
    render(
      <ModalForm {...defaultProps}>
        <div data-testid="modal-child">Child Content</div>
      </ModalForm>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render submit and cancel buttons with correct labels', () => {
    render(
      <ModalForm {...defaultProps}>
        <div>Content</div>
      </ModalForm>
    );

    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', () => {
    render(
      <ModalForm {...defaultProps}>
        <div>Content</div>
      </ModalForm>
    );

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }).closest('form')!);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when X button is clicked', () => {
    render(
      <ModalForm {...defaultProps}>
        <div>Content</div>
      </ModalForm>
    );

    // The X button doesn't have a name, but it's the first button in the header
    // It has a class "text-gray-400 hover:text-gray-600"
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when Cancel button is clicked', () => {
    render(
      <ModalForm {...defaultProps}>
        <div>Content</div>
      </ModalForm>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when isLoading is true', () => {
    render(
      <ModalForm {...defaultProps} isLoading={true}>
        <div>Content</div>
      </ModalForm>
    );

    const submitButton = screen.getByRole('button', { name: 'Saving...' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});