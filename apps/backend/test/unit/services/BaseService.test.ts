import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseService } from '../../../src/services/BaseService.js';
import { BaseRepository, BaseFilters } from '../../../src/models/BaseRepository.js';
import { AppError } from '../../../src/middleware/errorHandler.middleware.js';

// Test types
interface TestEntity {
  id: string;
  name: string;
  createdAt: Date;
}

interface TestCreateDto {
  name: string;
}

interface TestUpdateDto {
  name?: string;
}

interface TestFilters extends BaseFilters {
  name?: string;
}

// Concrete test service implementation
class TestService extends BaseService<TestEntity, TestCreateDto, TestUpdateDto, TestFilters> {
  constructor(repository: BaseRepository<TestEntity, TestCreateDto, TestUpdateDto>) {
    super(repository, 'TestEntity');
  }
}

describe('BaseService', () => {
  let service: TestService;
  let mockRepository: Partial<BaseRepository<TestEntity, TestCreateDto, TestUpdateDto>>;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock repository
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new TestService(mockRepository as BaseRepository<TestEntity, TestCreateDto, TestUpdateDto>);
  });

  describe('getAll()', () => {
    it('should call repository.findAll with filters and return results', async () => {
      const mockData = [
        { id: '1', name: 'Test 1', createdAt: new Date() },
        { id: '2', name: 'Test 2', createdAt: new Date() },
      ];
      const mockResponse = { data: mockData, total: 2 };
      const filters: TestFilters = { page: 1, limit: 10, name: 'Test' };

      vi.mocked(mockRepository.findAll!).mockResolvedValue(mockResponse);

      const result = await service.getAll(filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it('should handle empty results from repository', async () => {
      const mockResponse = { data: [], total: 0 };
      const filters: TestFilters = { page: 1, limit: 10 };

      vi.mocked(mockRepository.findAll!).mockResolvedValue(mockResponse);

      const result = await service.getAll(filters);

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('should pass through pagination parameters', async () => {
      const filters: TestFilters = { page: 2, limit: 25 };
      const mockResponse = { data: [], total: 0 };

      vi.mocked(mockRepository.findAll!).mockResolvedValue(mockResponse);

      await service.getAll(filters);

      expect(mockRepository.findAll).toHaveBeenCalledWith({ page: 2, limit: 25 });
    });

    it('should propagate repository errors', async () => {
      const filters: TestFilters = { page: 1, limit: 10 };
      const error = new Error('Database connection failed');

      vi.mocked(mockRepository.findAll!).mockRejectedValue(error);

      await expect(service.getAll(filters)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getById()', () => {
    it('should return entity when found by repository', async () => {
      const mockEntity: TestEntity = {
        id: '123',
        name: 'Test Entity',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.findById!).mockResolvedValue(mockEntity);

      const result = await service.getById('123');

      expect(mockRepository.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockEntity);
    });

    it('should throw 404 AppError when entity not found', async () => {
      vi.mocked(mockRepository.findById!).mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(AppError);
      await expect(service.getById('nonexistent')).rejects.toThrow('TestEntity not found');
    });

    it('should throw 404 AppError with correct status code', async () => {
      vi.mocked(mockRepository.findById!).mockResolvedValue(null);

      try {
        await service.getById('nonexistent');
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Database query failed');
      vi.mocked(mockRepository.findById!).mockRejectedValue(error);

      await expect(service.getById('123')).rejects.toThrow('Database query failed');
    });

    it('should handle different ID types correctly', async () => {
      const mockEntity: TestEntity = {
        id: 'uuid-123-456',
        name: 'Test',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.findById!).mockResolvedValue(mockEntity);

      await service.getById('uuid-123-456');

      expect(mockRepository.findById).toHaveBeenCalledWith('uuid-123-456');
    });
  });

  describe('create()', () => {
    it('should call repository.create with data and return created entity', async () => {
      const createDto: TestCreateDto = { name: 'New Entity' };
      const mockCreatedEntity: TestEntity = {
        id: '456',
        name: 'New Entity',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.create!).mockResolvedValue(mockCreatedEntity);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(mockCreatedEntity);
    });

    it('should pass userId to repository when provided', async () => {
      const createDto: TestCreateDto = { name: 'New Entity' };
      const userId = 'user-123';
      const mockCreatedEntity: TestEntity = {
        id: '456',
        name: 'New Entity',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.create!).mockResolvedValue(mockCreatedEntity);

      await service.create(createDto, userId);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto, userId);
    });

    it('should propagate repository errors', async () => {
      const createDto: TestCreateDto = { name: 'New Entity' };
      const error = new Error('Validation failed');

      vi.mocked(mockRepository.create!).mockRejectedValue(error);

      await expect(service.create(createDto)).rejects.toThrow('Validation failed');
    });

    it('should handle empty createDto', async () => {
      const createDto = {} as TestCreateDto;
      const mockCreatedEntity: TestEntity = {
        id: '789',
        name: '',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.create!).mockResolvedValue(mockCreatedEntity);

      const result = await service.create(createDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createDto, undefined);
      expect(result).toEqual(mockCreatedEntity);
    });
  });

  describe('update()', () => {
    it('should call repository.update and return updated entity', async () => {
      const updateDto: TestUpdateDto = { name: 'Updated Name' };
      const mockUpdatedEntity: TestEntity = {
        id: '123',
        name: 'Updated Name',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.update!).mockResolvedValue(mockUpdatedEntity);

      const result = await service.update('123', updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith('123', updateDto);
      expect(result).toEqual(mockUpdatedEntity);
    });

    it('should throw 404 AppError when entity not found', async () => {
      const updateDto: TestUpdateDto = { name: 'Updated Name' };

      vi.mocked(mockRepository.update!).mockResolvedValue(null);

      await expect(service.update('nonexistent', updateDto)).rejects.toThrow(AppError);
      await expect(service.update('nonexistent', updateDto)).rejects.toThrow('TestEntity not found');
    });

    it('should throw 404 AppError with correct status code', async () => {
      const updateDto: TestUpdateDto = { name: 'Updated Name' };

      vi.mocked(mockRepository.update!).mockResolvedValue(null);

      try {
        await service.update('nonexistent', updateDto);
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should handle partial updates', async () => {
      const partialUpdate: TestUpdateDto = { name: 'Only Name Updated' };
      const mockUpdatedEntity: TestEntity = {
        id: '123',
        name: 'Only Name Updated',
        createdAt: new Date(),
      };

      vi.mocked(mockRepository.update!).mockResolvedValue(mockUpdatedEntity);

      await service.update('123', partialUpdate);

      expect(mockRepository.update).toHaveBeenCalledWith('123', partialUpdate);
    });

    it('should propagate repository errors', async () => {
      const updateDto: TestUpdateDto = { name: 'Updated Name' };
      const error = new Error('Constraint violation');

      vi.mocked(mockRepository.update!).mockRejectedValue(error);

      await expect(service.update('123', updateDto)).rejects.toThrow('Constraint violation');
    });
  });

  describe('delete()', () => {
    it('should call repository.delete and return success', async () => {
      vi.mocked(mockRepository.delete!).mockResolvedValue(true);

      const result = await service.delete('123');

      expect(mockRepository.delete).toHaveBeenCalledWith('123');
      expect(result).toEqual({ success: true });
    });

    it('should throw 404 AppError when entity not found', async () => {
      vi.mocked(mockRepository.delete!).mockResolvedValue(false);

      await expect(service.delete('nonexistent')).rejects.toThrow(AppError);
      await expect(service.delete('nonexistent')).rejects.toThrow('TestEntity not found');
    });

    it('should throw 404 AppError with correct status code', async () => {
      vi.mocked(mockRepository.delete!).mockResolvedValue(false);

      try {
        await service.delete('nonexistent');
        expect.fail('Should have thrown AppError');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(404);
      }
    });

    it('should propagate repository errors', async () => {
      const error = new Error('Foreign key constraint');

      vi.mocked(mockRepository.delete!).mockRejectedValue(error);

      await expect(service.delete('123')).rejects.toThrow('Foreign key constraint');
    });

    it('should return success object with correct structure', async () => {
      vi.mocked(mockRepository.delete!).mockResolvedValue(true);

      const result = await service.delete('123');

      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      expect(typeof result.success).toBe('boolean');
    });
  });
});
