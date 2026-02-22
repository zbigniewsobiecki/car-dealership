import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MonthlySalesChart } from '../../src/components/dashboard/MonthlySalesChart';

describe('MonthlySalesChart', () => {
  const mockData = [
    { month: '2024-01-01', revenue: 100000, sales_count: 5 },
    { month: '2024-02-01', revenue: 150000, sales_count: 8 },
  ];

  it('renders correctly with data', () => {
    render(<MonthlySalesChart data={mockData} />);
    
    expect(screen.getByText('Monthly Performance')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Sales Volume')).toBeInTheDocument();
    
    // Check if months are formatted (Jan 24, Feb 24)
    // They appear twice: once for Revenue chart and once for Sales Volume chart
    expect(screen.getAllByText('Jan 24')).toHaveLength(2);
    expect(screen.getAllByText('Feb 24')).toHaveLength(2);
  });

  it('renders empty state when no data', () => {
    render(<MonthlySalesChart data={[]} />);
    expect(screen.getByText(/No sales data available/i)).toBeInTheDocument();
  });

  it('renders empty state when data is undefined', () => {
    render(<MonthlySalesChart data={undefined} />);
    expect(screen.getByText(/No sales data available/i)).toBeInTheDocument();
  });
});