import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Response } from 'express';
import { BaseController } from '../../../src/controllers/BaseController.js';

// TestController to expose protected methods for testing
class TestController extends BaseController {
  public testOk<T>(res: Response, data?: T) {
    return this.ok(res, data);
  }

  public testCreated<T>(res: Response, data?: T) {
    return this.created(res, data);
  }

  public testMessage(res: Response, message: string) {
    return this.message(res, message);
  }

  public testPaginate<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number
  ) {
    return this.paginate(res, data, page, limit, total);
  }
}

describe('BaseController', () => {
  let controller: TestController;
  let res: Partial<Response>;
  let statusMock: ReturnType<typeof vi.fn>;
  let jsonMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new TestController();

    // Create mock functions
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    // Create mock response object
    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  describe('ok()', () => {
    it('should return 200 status with success: true and data', () => {
      const testData = { id: 1, name: 'test' };

      controller.testOk(res as Response, testData);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: testData,
      });
    });

    it('should return 200 status with success: true and undefined data', () => {
      controller.testOk(res as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: undefined,
      });
    });

    it('should call status() before json() for method chaining', () => {
      const testData = { id: 2, value: 'test' };

      controller.testOk(res as Response, testData);

      expect(statusMock).toHaveBeenCalledBefore(jsonMock);
    });

    it('should handle array data', () => {
      const testData = [{ id: 1 }, { id: 2 }, { id: 3 }];

      controller.testOk(res as Response, testData);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: testData,
      });
    });
  });

  describe('created()', () => {
    it('should return 201 status with success: true and data', () => {
      const testData = { id: 1, name: 'new item' };

      controller.testCreated(res as Response, testData);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: testData,
      });
    });

    it('should return 201 status with success: true and undefined data', () => {
      controller.testCreated(res as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: undefined,
      });
    });

    it('should use 201 status code, not 200', () => {
      const testData = { id: 5 };

      controller.testCreated(res as Response, testData);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(statusMock).not.toHaveBeenCalledWith(200);
    });
  });

  describe('message()', () => {
    it('should return 200 status with success: true and message string', () => {
      const testMessage = 'Operation successful';

      controller.testMessage(res as Response, testMessage);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: testMessage,
      });
    });

    it('should include message field, not data field', () => {
      const testMessage = 'Test message';

      controller.testMessage(res as Response, testMessage);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs).toHaveProperty('message');
      expect(callArgs).not.toHaveProperty('data');
    });

    it('should handle different message strings', () => {
      const messages = [
        'Customer deleted successfully',
        'Vehicle updated',
        'Sale created',
      ];

      messages.forEach(msg => {
        vi.clearAllMocks();
        controller.testMessage(res as Response, msg);

        expect(jsonMock).toHaveBeenCalledWith({
          success: true,
          message: msg,
        });
      });
    });
  });

  describe('paginate()', () => {
    it('should return proper PaginatedResponse structure with full page', () => {
      const testData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const page = 1;
      const limit = 10;
      const total = 25;

      controller.testPaginate(res as Response, testData, page, limit, total);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: testData,
        pagination: {
          page: 1,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      });
    });

    it('should calculate totalPages correctly: 25 total / 10 limit = 3 pages', () => {
      controller.testPaginate(res as Response, [], 1, 10, 25);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(3);
    });

    it('should calculate totalPages correctly: 10 total / 10 limit = 1 page', () => {
      controller.testPaginate(res as Response, [], 1, 10, 10);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(1);
    });

    it('should calculate totalPages correctly: 1 total / 10 limit = 1 page', () => {
      controller.testPaginate(res as Response, [], 1, 10, 1);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(1);
    });

    it('should calculate totalPages correctly: 0 total / 10 limit = 0 pages', () => {
      controller.testPaginate(res as Response, [], 1, 10, 0);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(0);
    });

    it('should work with empty data array', () => {
      controller.testPaginate(res as Response, [], 1, 10, 0);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        },
      });
    });

    it('should update pagination metadata for different page numbers', () => {
      const testData = [{ id: 11 }, { id: 12 }];

      controller.testPaginate(res as Response, testData, 2, 10, 25);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: testData,
        pagination: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      });
    });

    it('should handle partial pages: 23 total / 10 limit = 3 pages', () => {
      controller.testPaginate(res as Response, [], 1, 10, 23);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(3);
    });

    it('should handle exact multiples: 30 total / 10 limit = 3 pages', () => {
      controller.testPaginate(res as Response, [], 1, 10, 30);

      const callArgs = jsonMock.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(3);
    });
  });
});
