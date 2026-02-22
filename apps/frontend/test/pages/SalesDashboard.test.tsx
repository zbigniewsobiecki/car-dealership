import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SalesDashboard } from '../../src/pages/SalesDashboard';
import { MemoryRouter } from 'react-router-dom';
import { useSalesStats, useMonthlySalesStats, useSales } from '../../src/hooks/useSales';
import { useRevenueReport } from '../../src/hooks/useReports';
import { useAuthStore } from '../../src/store/authStore';
import { UserRole } from '@car-dealership/shared-types';

// Mock the hooks
vi.mock('../../src/hooks/useSales', () => ({
  useSalesStats: vi.fn(),
  useMonthlySalesStats: vi.fn(),
  useSales: vi.fn(),
}));

vi.mock('../../src/hooks/useReports', () => ({
  useRevenueReport: vi.fn(),
}));

vi.mock('../../src/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const renderSalesDashboard = () => {
  return render(
    <MemoryRouter>
      <SalesDashboard />
    </MemoryRouter>
  );
};

describe('SalesDashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for non-admin user
    vi.mocked(useAuthStore).mockReturnValue({
      user: { role: UserRole.SALESPERSON },
    } as never);

    vi.mocked(useSalesStats).mockReturnValue({ isLoading: false, data: { total_revenue: 100000, average_sale_price: 20000, completed_sales: 5 } } as never);
    vi.mocked(useMonthlySalesStats).mockReturnValue({ isLoading: false, data: [] } as never);
    vi.mocked(useSales).mockReturnValue({ isLoading: false, data: [] } as never);
    vi.mocked(useRevenueReport).mockReturnValue({ isLoading: false, data: null, refetch: vi.fn() } as never);
  });

  it('renders loading state', () => {
    vi.mocked(useSalesStats).mockReturnValue({ isLoading: true } as never);
    renderSalesDashboard();
    expect(screen.getByText(/Loading sales analytics.../i)).toBeInTheDocument();
  });

  it('renders main components for salesperson', () => {
    renderSalesDashboard();
    
    expect(screen.getByText('Sales Dashboard')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument(); // Total Revenue
    expect(screen.getByText('$20,000')).toBeInTheDocument(); // Avg Sale Price
    expect(screen.getByText('5')).toBeInTheDocument(); // Completed Sales
    
    // Revenue Report should NOT be visible for salesperson
    expect(screen.queryByText('Revenue Report')).not.toBeInTheDocument();
  });

  it('renders Revenue Report section for admin', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { role: UserRole.ADMIN },
    } as never);

    vi.mocked(useRevenueReport).mockReturnValue({
      isLoading: false,
      data: { totalRevenue: 50000, saleCount: 2, averageSalePrice: 25000 },
      refetch: vi.fn(),
    } as never);

    renderSalesDashboard();
    
    expect(screen.getByText('Revenue Report')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('calls refetch when filter button is clicked', () => {
    const refetchMock = vi.fn();
    vi.mocked(useAuthStore).mockReturnValue({
      user: { role: UserRole.ADMIN },
    } as never);

    vi.mocked(useRevenueReport).mockReturnValue({
      isLoading: false,
      data: null,
      refetch: refetchMock,
    } as never);

    renderSalesDashboard();
    
    const filterButton = screen.getByText('Filter');
    fireEvent.click(filterButton);
    
    expect(refetchMock).toHaveBeenCalled();
  });
});