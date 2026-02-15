import { http, HttpResponse } from 'msw';
import { UserRole, VehicleStatus, SaleStatus, RepairStatus } from '@car-dealership/shared-types';

const API_URL = 'http://localhost:3000/api';

// Mock data
export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: UserRole.ADMIN,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockVehicle = {
  id: 'vehicle-1',
  vin: 'ABC123456789',
  make: 'Toyota',
  model: 'Camry',
  year: 2022,
  color: 'Blue',
  mileage: 15000,
  price: 25000,
  status: VehicleStatus.AVAILABLE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockCustomer = {
  id: 'customer-1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '555-1234',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockSale = {
  id: 'sale-1',
  vehicleId: 'vehicle-1',
  customerId: 'customer-1',
  salePrice: 24000,
  status: SaleStatus.PENDING,
  saleDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockRepair = {
  id: 'repair-1',
  vehicleId: 'vehicle-1',
  customerId: 'customer-1',
  description: 'Oil change and tire rotation',
  status: RepairStatus.IN_PROGRESS,
  cost: 150,
  startDate: new Date().toISOString(),
  technician: 'John Smith',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const handlers = [
  // Auth handlers
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        },
      });
    }
    return HttpResponse.json(
      { success: false, error: { message: 'Invalid email or password' } },
      { status: 401 }
    );
  }),

  http.post(`${API_URL}/auth/register`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        user: { ...mockUser, ...body },
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      },
    });
  }),

  http.post(`${API_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: mockUser,
        token: 'new-mock-jwt-token',
        refreshToken: 'new-mock-refresh-token',
      },
    });
  }),

  http.get(`${API_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { success: false, error: { message: 'Authentication required' } },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      success: true,
      data: mockUser,
    });
  }),

  // Vehicles handlers
  http.get(`${API_URL}/vehicles`, () => {
    return HttpResponse.json({
      success: true,
      data: [mockVehicle],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
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
        totalInventoryValue: 250000,
      },
    });
  }),

  http.get(`${API_URL}/vehicles/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockVehicle, id: params.id },
    });
  }),

  http.post(`${API_URL}/vehicles`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockVehicle, ...(body as object), id: 'new-vehicle-id' },
    }, { status: 201 });
  }),

  http.put(`${API_URL}/vehicles/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockVehicle, ...(body as object), id: params.id },
    });
  }),

  http.delete(`${API_URL}/vehicles/:id`, () => {
    return HttpResponse.json({
      success: true,
      data: { success: true },
    });
  }),

  // Customers handlers
  http.get(`${API_URL}/customers`, () => {
    return HttpResponse.json({
      success: true,
      data: [mockCustomer],
    });
  }),

  http.get(`${API_URL}/customers/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockCustomer, id: params.id },
    });
  }),

  http.post(`${API_URL}/customers`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockCustomer, ...(body as object), id: 'new-customer-id' },
    }, { status: 201 });
  }),

  http.put(`${API_URL}/customers/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockCustomer, ...(body as object), id: params.id },
    });
  }),

  http.delete(`${API_URL}/customers/:id`, () => {
    return HttpResponse.json({
      success: true,
      data: { success: true },
    });
  }),

  // Sales handlers
  http.get(`${API_URL}/sales`, () => {
    return HttpResponse.json({
      success: true,
      data: [mockSale],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    });
  }),

  http.get(`${API_URL}/sales/stats`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        totalSales: 10,
        totalRevenue: 200000,
        pendingSales: 3,
        completedSales: 6,
        cancelledSales: 1,
      },
    });
  }),

  http.get(`${API_URL}/sales/monthly`, () => {
    return HttpResponse.json({
      success: true,
      data: [
        { month: '2024-01', count: 5, revenue: 100000 },
        { month: '2024-02', count: 5, revenue: 100000 },
      ],
    });
  }),

  http.get(`${API_URL}/sales/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockSale, id: params.id },
    });
  }),

  http.post(`${API_URL}/sales`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockSale, ...(body as object), id: 'new-sale-id' },
    }, { status: 201 });
  }),

  http.put(`${API_URL}/sales/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockSale, ...(body as object), id: params.id },
    });
  }),

  http.delete(`${API_URL}/sales/:id`, () => {
    return HttpResponse.json({
      success: true,
      data: { success: true },
    });
  }),

  // Repairs handlers
  http.get(`${API_URL}/repairs`, () => {
    return HttpResponse.json({
      success: true,
      data: [mockRepair],
    });
  }),

  http.get(`${API_URL}/repairs/:id`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { ...mockRepair, id: params.id },
    });
  }),

  http.post(`${API_URL}/repairs`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockRepair, ...(body as object), id: 'new-repair-id' },
    }, { status: 201 });
  }),

  http.patch(`${API_URL}/repairs/:id`, async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({
      success: true,
      data: { ...mockRepair, ...(body as object), id: params.id },
    });
  }),

  http.delete(`${API_URL}/repairs/:id`, () => {
    return HttpResponse.json({
      success: true,
      message: 'Repair deleted successfully',
    });
  }),
];
