import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { Dashboard } from '../../src/pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { mockVehicle } from '../mocks/handlers';

const API_URL = 'http://localhost:3000/api';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Dashboard Page', () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_URL}/vehicles/recent`, () => {
        return HttpResponse.json({
          success: true,
          data: [mockVehicle],
        });
      }),
      http.get(`${API_URL}/vehicles/stats`, () => {
        return HttpResponse.json({
          success: true,
          data: {
            total: 10,
            available: 5,
            sold: 3,
            reserved: 1,
            maintenance: 1,
            total_inventory_value: 250000,
          },
        });
      }),
      http.get(`${API_URL}/sales/stats`, () => {
        return HttpResponse.json({
          success: true,
          data: {
            total_sales: 10,
            total_revenue: 200000,
            pending_sales: 3,
            completed_sales: 6,
            cancelled_sales: 1,
            average_sale_price: 20000
          },
        });
      })
    );
  });

  it('renders loading state initially', () => {
    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/Loading dashboard.../i)).toBeInTheDocument();
  });

  it('renders vehicle and sales statistics correctly', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Total Vehicles')).toBeInTheDocument();
    // '10' appears in: Total Vehicles card, Total Inventory overview, Total Sales overview
    expect(screen.getAllByText('10')).toHaveLength(3);
    expect(screen.getAllByText('5')).toHaveLength(2);
    // '3' appears in: Sold overview and Pending Sales overview
    expect(screen.getAllByText('3')).toHaveLength(2);
    
    expect(screen.getByText(/\$250,000/)).toBeInTheDocument();

    expect(screen.getAllByText('6')).toHaveLength(2);
    expect(screen.getAllByText(/\$200,000/)).toHaveLength(2);
    expect(screen.getByText('Average Sale Price')).toBeInTheDocument();
  });

  it('renders recently added vehicles table', async () => {
    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Vehicle')).toBeInTheDocument();
    expect(screen.getByText('VIN')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();

    expect(screen.getByText('2022 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('ABC123456789')).toBeInTheDocument();
    expect(screen.getByText(/\$25,000/)).toBeInTheDocument();
    expect(screen.getByText('available')).toBeInTheDocument();
  });

  it('renders empty state when no recent vehicles are returned', async () => {
    server.use(
      http.get(`${API_URL}/vehicles/recent`, () => {
        return HttpResponse.json({
          success: true,
          data: [],
        });
      })
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/No vehicles found/i)).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    server.use(
      http.get(`${API_URL}/vehicles/stats`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get(`${API_URL}/sales/stats`, () => {
        return new HttpResponse(null, { status: 500 });
      }),
      http.get(`${API_URL}/vehicles/recent`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading dashboard.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(10);
  });
});