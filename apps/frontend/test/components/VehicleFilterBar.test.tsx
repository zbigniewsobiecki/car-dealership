import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VehicleFilterBar } from '../../src/components/vehicles/VehicleFilterBar';
import { VehicleType } from '@car-dealership/shared-types';

describe('VehicleFilterBar', () => {
  const mockProps = {
    searchTerm: '',
    onSearchTermChange: vi.fn(),
    priceMin: '',
    onPriceMinChange: vi.fn(),
    priceMax: '',
    onPriceMaxChange: vi.fn(),
    type: '',
    onTypeChange: vi.fn(),
    onSearch: vi.fn(),
    onClear: vi.fn(),
    isFiltered: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search by make, model, or VIN...');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders vehicle type select with all options', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const typeSelect = screen.getByRole('combobox');
    expect(typeSelect).toBeInTheDocument();
    expect(screen.getByText('All Types')).toBeInTheDocument();
    expect(screen.getByText('Car')).toBeInTheDocument();
    expect(screen.getByText('Motorcycle')).toBeInTheDocument();
  });

  it('renders price range inputs', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const priceMinInput = screen.getByPlaceholderText('Min Price');
    const priceMaxInput = screen.getByPlaceholderText('Max Price');
    expect(priceMinInput).toBeInTheDocument();
    expect(priceMaxInput).toBeInTheDocument();
  });

  it('renders Search button', () => {
    render(<VehicleFilterBar {...mockProps} />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('does not render Clear button when not filtered', () => {
    render(<VehicleFilterBar {...mockProps} isFiltered={false} />);
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('renders Clear button when filtered', () => {
    render(<VehicleFilterBar {...mockProps} isFiltered={true} />);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('calls onSearchTermChange when search input changes', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const searchInput = screen.getByPlaceholderText('Search by make, model, or VIN...');
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    expect(mockProps.onSearchTermChange).toHaveBeenCalledWith('Toyota');
  });

  it('calls onTypeChange when vehicle type select changes', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const typeSelect = screen.getByRole('combobox');
    fireEvent.change(typeSelect, { target: { value: VehicleType.CAR } });
    expect(mockProps.onTypeChange).toHaveBeenCalledWith(VehicleType.CAR);
  });

  it('calls onPriceMinChange when min price input changes', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const priceMinInput = screen.getByPlaceholderText('Min Price');
    fireEvent.change(priceMinInput, { target: { value: '20000' } });
    expect(mockProps.onPriceMinChange).toHaveBeenCalledWith('20000');
  });

  it('calls onPriceMaxChange when max price input changes', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const priceMaxInput = screen.getByPlaceholderText('Max Price');
    fireEvent.change(priceMaxInput, { target: { value: '30000' } });
    expect(mockProps.onPriceMaxChange).toHaveBeenCalledWith('30000');
  });

  it('calls onSearch when Search button is clicked', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('calls onSearch when form is submitted', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const searchButton = screen.getByText('Search');
    fireEvent.submit(searchButton.closest('form')!);
    expect(mockProps.onSearch).toHaveBeenCalled();
  });

  it('calls onClear when Clear button is clicked', () => {
    render(<VehicleFilterBar {...mockProps} isFiltered={true} />);
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  it('displays current search term value', () => {
    render(<VehicleFilterBar {...mockProps} searchTerm="Honda" />);
    const searchInput = screen.getByPlaceholderText('Search by make, model, or VIN...') as HTMLInputElement;
    expect(searchInput.value).toBe('Honda');
  });

  it('displays current type value', () => {
    render(<VehicleFilterBar {...mockProps} type={VehicleType.CAR} />);
    const typeSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(typeSelect.value).toBe(VehicleType.CAR);
  });

  it('displays current price range values', () => {
    render(<VehicleFilterBar {...mockProps} priceMin="10000" priceMax="50000" />);
    const priceMinInput = screen.getByPlaceholderText('Min Price') as HTMLInputElement;
    const priceMaxInput = screen.getByPlaceholderText('Max Price') as HTMLInputElement;
    expect(priceMinInput.value).toBe('10000');
    expect(priceMaxInput.value).toBe('50000');
  });

  it('price inputs have min="0" attribute', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const priceMinInput = screen.getByPlaceholderText('Min Price');
    const priceMaxInput = screen.getByPlaceholderText('Max Price');
    expect(priceMinInput).toHaveAttribute('min', '0');
    expect(priceMaxInput).toHaveAttribute('min', '0');
  });

  it('price inputs are of type number', () => {
    render(<VehicleFilterBar {...mockProps} />);
    const priceMinInput = screen.getByPlaceholderText('Min Price');
    const priceMaxInput = screen.getByPlaceholderText('Max Price');
    expect(priceMinInput).toHaveAttribute('type', 'number');
    expect(priceMaxInput).toHaveAttribute('type', 'number');
  });
});
