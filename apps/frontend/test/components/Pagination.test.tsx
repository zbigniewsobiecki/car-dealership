import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../../src/components/shared/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={1} totalItems={10} />
    );
    expect(container.firstChild).toBeNull();

    const { container: containerZero } = render(
      <Pagination {...defaultProps} totalPages={0} totalItems={0} />
    );
    expect(containerZero.firstChild).toBeNull();
  });

  it('should render item range correctly on first page', () => {
    render(<Pagination {...defaultProps} />);
    
    // "Showing 1 to 10 of 50 results"
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    // Use getAllByText and check if at least one exists, or be more specific
    // The range numbers are in spans with class "font-medium"
    const showingText = screen.getByText(/Showing/);
    expect(showingText).toHaveTextContent('1');
    expect(showingText).toHaveTextContent('10');
    expect(showingText).toHaveTextContent('50');
  });

  it('should render item range correctly on middle page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    // "Showing 21 to 30 of 50 results"
    const showingText = screen.getByText(/Showing/);
    expect(showingText).toHaveTextContent('21');
    expect(showingText).toHaveTextContent('30');
  });

  it('should render item range correctly on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalItems={45} />);
    
    // "Showing 41 to 45 of 45 results"
    const showingText = screen.getByText(/Showing/);
    expect(showingText).toHaveTextContent('41');
    expect(showingText).toHaveTextContent('45');
  });

  it('should call onPageChange when specific page number is clicked', () => {
    render(<Pagination {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should call onPageChange when Next is clicked', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    // There are two "Next" buttons (one for mobile, one for desktop)
    const nextButtons = screen.getAllByRole('button', { name: /Next/i });
    fireEvent.click(nextButtons[0]);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when Previous is clicked', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const prevButtons = screen.getAllByRole('button', { name: /Previous/i });
    fireEvent.click(prevButtons[0]);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should disable Previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);
    
    const prevButtons = screen.getAllByRole('button', { name: /Previous/i });
    prevButtons.forEach(btn => expect(btn).toBeDisabled());
  });

  it('should disable Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />);
    
    const nextButtons = screen.getAllByRole('button', { name: /Next/i });
    nextButtons.forEach(btn => expect(btn).toBeDisabled());
  });

  it('should highlight the current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);
    
    const currentPageButton = screen.getByRole('button', { name: '3' });
    expect(currentPageButton).toHaveClass('bg-indigo-600');
    expect(currentPageButton).toHaveClass('text-white');
  });
});