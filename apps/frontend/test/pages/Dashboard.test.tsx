import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dashboard } from '../../src/pages/Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { useVehicleStats, useRecentVehicles } from '../../src/hooks/useVehicles';
import { useSalesStats } from '../../src/hooks/useSales';
import { useMonthlyStats } from '../../src/hooks/useReports';

// Mock the hooks
vi.mock('../../src/hooks/useVehicles', () => ({
  useVehicleStats: vi.fn(),
  useRecentVehicles: vi.fn(),
}));

vi.mock('../../src/hooks/useSales', () => ({
  useSalesStats: vi.fn(),
}));

vi.mock('../../src/hooks/useReports', () => ({
  useMonthlyStats: vi.fn(),
}));

const renderDashboard = () => {
  return render(
    <MemoryRouter>
      <Dashboard />
    </MemoryRouter>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when data is fetching', () => {
    vi.mocked(useVehicleStats).mockReturnValue({ isLoading: true, data: undefined } as never);
    vi.mocked(useSalesStats).mockReturnValue({ isLoading: false, data: undefined } as never);
    vi.mocked(useRecentVehicles).mockReturnValue({ isLoading: false, data: undefined } as never);
    vi.mocked(useMonthlyStats).mockReturnValue({ isLoading: false, data: undefined } as never);

    renderDashboard();
    expect(screen.getByText(/Loading dashboard.../i)).toBeInTheDocument();
  });

  it('renders stats cards with correct formatted values', () => {
    vi.mocked(useVehicleStats).mockReturnValue({
      isLoading: false,
      data: {
        total: 100,
        available: 75,
        sold: 20,
        reserved: 3,
        maintenance: 2,
        total_inventory_value: 2500000,
      },
    } as never);

    vi.mocked(useSalesStats).mockReturnValue({
      isLoading: false,
      data: {
        total_sales: 50,
        completed_sales: 45,
        pending_sales: 5,
        total_revenue: 1250000,
        average_sale_price: 25000,
      },
    } as never);

    vi.mocked(useRecentVehicles).mockReturnValue({
      isLoading: false,
      data: [],
    } as never);

    vi.mocked(useMonthlyStats).mockReturnValue({
      isLoading: false,
      data: [],
    } as never);

    renderDashboard();

    // Check main stats cards (some values appear in both card and overview)
    expect(screen.getAllByText('100')).toHaveLength(2); // Total Vehicles + Total Inventory
    expect(screen.getAllByText('75')).toHaveLength(2);  // Available (card + overview)
    expect(screen.getAllByText('45')).toHaveLength(2);  // Total Sales (card + overview)
    expect(screen.getAllByText('$1,250,000')).toHaveLength(2); // Total Revenue (card + overview)

    // Check Overview sections
    expect(screen.getByText('Vehicle Overview')).toBeInTheDocument();
    expect(screen.getByText('Sales Overview')).toBeInTheDocument();
    expect(screen.getByText('$2,500,000')).toBeInTheDocument(); // Total Inventory Value
    expect(screen.getByText('$25,000')).toBeInTheDocument();    // Average Sale Price
  });

  it('renders recently added vehicles table with mock data', () => {
    const mockVehicles = [
      {
        id: '1',
        year: 2022,
        make: 'Toyota',
        model: 'Camry',
        vin: 'VIN123',
        price: 25000,
        status: 'available',
        createdAt: '2023-01-01T00:00:00Z',
      },
      {
        id: '2',
        year: 2021,
        make: 'Honda',
        model: 'Civic',
        vin: 'VIN456',
        price: 22000,
        status: 'sold',
        createdAt: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(useVehicleStats).mockReturnValue({ isLoading: false, data: {} } as never);
    vi.mocked(useSalesStats).mockReturnValue({ isLoading: false, data: {} } as never);
    vi.mocked(useRecentVehicles).mockReturnValue({
      isLoading: false,
      data: mockVehicles,
    } as never);

    renderDashboard();

    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('VIN123')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();

    expect(screen.getByText('2021 Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('VIN456')).toBeInTheDocument();
    expect(screen.getByText('$22,000')).toBeInTheDocument();
    expect(screen.getByText('sold')).toBeInTheDocument();
  });

  it('renders empty state message when no vehicles are found', () => {
    vi.mocked(useVehicleStats).mockReturnValue({ isLoading: false, data: {} } as never);
    vi.mocked(useSalesStats).mockReturnValue({ isLoading: false, data: {} } as never);
    vi.mocked(useRecentVehicles).mockReturnValue({
      isLoading: false,
      data: [],
    } as never);

    vi.mocked(useMonthlyStats).mockReturnValue({
      isLoading: false,
      data: [],
    } as never);

    renderDashboard();

    expect(screen.getByText(/No vehicles found/i)).toBeInTheDocument();
  });
});