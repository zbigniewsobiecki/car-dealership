import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecentSalesTable } from '../../src/components/dashboard/RecentSalesTable';
import { MemoryRouter } from 'react-router-dom';
import { SaleStatus } from '@car-dealership/shared-types';

describe('RecentSalesTable', () => {
  const mockSales = [
    {
      id: 'sale-1',
      vehicleId: 'vehicle-12345678',
      customerId: 'customer-1',
      salespersonId: 'user-1',
      salePrice: 25000,
      saleDate: new Date('2024-01-01'),
      status: SaleStatus.COMPLETED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('renders correctly with sales data', () => {
    render(
      <MemoryRouter>
        <RecentSalesTable sales={mockSales} />
      </MemoryRouter>
    );

    expect(screen.getByText('Recent Sales')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
    expect(screen.getByText(/vehicle-\.\.\./)).toBeInTheDocument();
  });

  it('renders empty state when no sales', () => {
    render(
      <MemoryRouter>
        <RecentSalesTable sales={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/No recent sales found/i)).toBeInTheDocument();
  });
});