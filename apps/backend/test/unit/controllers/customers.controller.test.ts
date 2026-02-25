import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { createMockCustomer, createMockCreateCustomerDto, createMockUpdateCustomerDto } from '../../factories/customer.factory.js';
import { createMockSale } from '../../factories/sale.factory.js';

// Mock customersService
const mockCustomersService = {
  getAll: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  getSales: vi.fn(),
};

vi.mock('../../../src/services/customers.service.js', () => ({
  customersService: mockCustomersService,
}));

// Import after mocking
const { customersController } = await import('../../../src/controllers/customers.controller.js');

describe('customersController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock functions
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    req = {
      params: {},
      query: {},
      body: {},
      user: { userId: 'user-123', role: 'manager' },
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = vi.fn();
  });

  describe('getAll()', () => {
    it('should return all customers with 200 status', async () => {
      const mockCustomers = [
        createMockCustomer({ id: 'customer-1', firstName: 'John' }),
        createMockCustomer({ id: 'customer-2', firstName: 'Jane' }),
      ];
      mockCustomersService.getAll.mockResolvedValue({ data: mockCustomers });

      await customersController.getAll(req as Request, res as Response, next);

      expect(mockCustomersService.getAll).toHaveBeenCalledWith({});
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCustomers,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return empty array when no customers exist', async () => {
      mockCustomersService.getAll.mockResolvedValue({ data: [] });

      await customersController.getAll(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });
  });

  describe('getById()', () => {
    it('should return single customer by ID with 200 status', async () => {
      const mockCustomer = createMockCustomer({ id: 'customer-123' });
      req.params = { id: 'customer-123' };
      mockCustomersService.getById.mockResolvedValue(mockCustomer);

      await customersController.getById(req as Request, res as Response, next);

      expect(mockCustomersService.getById).toHaveBeenCalledWith('customer-123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCustomer,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('create()', () => {
    it('should create customer with req.user!.userId and return 201 status', async () => {
      const createDto = createMockCreateCustomerDto();
      const mockCustomer = createMockCustomer({ id: 'new-customer-id' });
      req.body = createDto;
      req.user = { userId: 'user-456', role: 'manager' };
      mockCustomersService.create.mockResolvedValue(mockCustomer);

      await customersController.create(req as Request, res as Response, next);

      expect(mockCustomersService.create).toHaveBeenCalledWith(createDto, 'user-456');
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCustomer,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should use userId from authenticated user', async () => {
      const createDto = createMockCreateCustomerDto();
      const mockCustomer = createMockCustomer();
      req.body = createDto;
      req.user = { userId: 'specific-user-789', role: 'admin' };
      mockCustomersService.create.mockResolvedValue(mockCustomer);

      await customersController.create(req as Request, res as Response, next);

      expect(mockCustomersService.create).toHaveBeenCalledWith(createDto, 'specific-user-789');
    });
  });

  describe('update()', () => {
    it('should update customer and return updated data with 200 status', async () => {
      const updateDto = createMockUpdateCustomerDto({ phone: '555-1111' });
      const mockCustomer = createMockCustomer({ id: 'customer-123', phone: '555-1111' });
      req.params = { id: 'customer-123' };
      req.body = updateDto;
      mockCustomersService.update.mockResolvedValue(mockCustomer);

      await customersController.update(req as Request, res as Response, next);

      expect(mockCustomersService.update).toHaveBeenCalledWith('customer-123', updateDto);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockCustomer,
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('delete()', () => {
    it('should soft delete customer by default and return message', async () => {
      req.params = { id: 'customer-123' };
      req.query = {};
      mockCustomersService.delete.mockResolvedValue({ success: true });

      await customersController.delete(req as Request, res as Response, next);

      expect(mockCustomersService.delete).toHaveBeenCalledWith('customer-123', false);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Customer soft deleted',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should hard delete when ?hard=true and user is admin', async () => {
      req.params = { id: 'customer-123' };
      req.query = { hard: 'true' };
      req.user = { userId: 'admin-user', role: 'admin' };
      mockCustomersService.delete.mockResolvedValue({ success: true });

      await customersController.delete(req as Request, res as Response, next);

      expect(mockCustomersService.delete).toHaveBeenCalledWith('customer-123', true);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Customer permanently deleted',
      });
    });

    it('should throw 403 error when non-admin tries hard delete', async () => {
      req.params = { id: 'customer-123' };
      req.query = { hard: 'true' };
      req.user = { userId: 'manager-user', role: 'manager' };

      await customersController.delete(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Only admins can perform hard deletes');
      expect(mockCustomersService.delete).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('getSales()', () => {
    it('should return customer sales history with 200 status', async () => {
      const mockSales = [
        createMockSale({ id: 'sale-1', customerId: 'customer-123' }),
        createMockSale({ id: 'sale-2', customerId: 'customer-123' }),
      ];
      req.params = { id: 'customer-123' };
      mockCustomersService.getSales.mockResolvedValue(mockSales);

      await customersController.getSales(req as Request, res as Response, next);

      expect(mockCustomersService.getSales).toHaveBeenCalledWith('customer-123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: mockSales,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return empty array when customer has no sales', async () => {
      req.params = { id: 'customer-123' };
      mockCustomersService.getSales.mockResolvedValue([]);

      await customersController.getSales(req as Request, res as Response, next);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });
  });
});
