import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module using hoisted mock pattern from existing tests
const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../../../src/models/db.js', () => ({
  query: mockQuery,
}));

// Import BaseRepository after mocking db
import { BaseRepository, RepositoryConfig } from '../../../src/models/BaseRepository.js';

// Define a test entity interface
interface TestEntity {
  id: string;
  testName: string;
  someDate: Date;
  createdAt: Date;
  updatedAt: Date;
  customField?: string;
  deletedAt?: Date;
}

// Create a concrete TestRepository class to expose protected methods
class TestRepository extends BaseRepository<TestEntity> {
  // Expose protected methods for testing
  public testMapRow(row: Record<string, unknown>): TestEntity {
    return this.dataMapper.mapRow<TestEntity>(row);
  }

  public testMapToDb(data: Record<string, unknown>): Record<string, unknown> {
    return this.dataMapper.mapToDb(data);
  }

  public testBuildWhereClause(key: string, value: unknown, paramCount: number): { sql: string; value: unknown } | null {
    return this.buildWhereClause(key, value, paramCount);
  }
}

describe('BaseRepository', () => {
  let testRepo: TestRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    const config: RepositoryConfig = {
      tableName: 'test_entities',
      softDelete: true,
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'updated_at', 'test_name'],
      allowedFilterFields: ['testName', 'customField'],
      fieldMap: {
        customField: 'custom_field',
      },
    };
    testRepo = new TestRepository(config);
  });

  describe('constructor', () => {
    it('should initialize with provided configuration', () => {
      expect(testRepo).toBeInstanceOf(TestRepository);
      expect(testRepo).toBeInstanceOf(BaseRepository);
    });
  });

  describe('mapRow', () => {
    it('should automatically convert snake_case to camelCase', () => {
      const row = {
        id: 'test-1',
        test_name: 'Test Entity',
        some_date: '2024-01-01T12:00:00.000Z',
        created_at: new Date('2024-01-01T10:00:00.000Z'),
        updated_at: new Date('2024-01-01T11:00:00.000Z'),
        deleted_at: null,
      };

      const result = testRepo.testMapRow(row);

      expect(result).toEqual({
        id: 'test-1',
        testName: 'Test Entity',
        someDate: new Date('2024-01-01T12:00:00.000Z'),
        createdAt: new Date('2024-01-01T10:00:00.000Z'),
        updatedAt: new Date('2024-01-01T11:00:00.000Z'),
        deletedAt: null,
      });
    });

    it('should use custom fieldMap overrides for reverse mapping', () => {
      const row = {
        id: 'test-2',
        custom_field: 'Custom Value',
        test_name: 'Another Test',
        created_at: new Date(),
        updated_at: new Date(),
      };

      const result = testRepo.testMapRow(row);

      expect(result.customField).toBe('Custom Value');
      expect(result.testName).toBe('Another Test');
    });

    it('should convert date strings to Date objects', () => {
      const row = {
        id: 'test-3',
        test_name: 'Date Test',
        some_date: '2024-02-15T08:30:00.000Z',
        created_at: '2024-02-15T08:00:00.000Z',
        updated_at: new Date('2024-02-15T08:15:00.000Z'),
      };

      const result = testRepo.testMapRow(row);

      expect(result.someDate).toBeInstanceOf(Date);
      expect(result.someDate.toISOString()).toBe('2024-02-15T08:30:00.000Z');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe('2024-02-15T08:00:00.000Z');
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.updatedAt.toISOString()).toBe('2024-02-15T08:15:00.000Z');
    });

    it('should ignore full_count column', () => {
      const row = {
        id: 'test-4',
        test_name: 'Full Count Test',
        created_at: new Date(),
        updated_at: new Date(),
        full_count: 42,
      };

      const result = testRepo.testMapRow(row);

      expect(result).not.toHaveProperty('full_count');
      expect(result).not.toHaveProperty('fullCount');
    });
  });

  describe('mapToDb', () => {
    it('should automatically convert camelCase to snake_case', () => {
      const data = {
        testName: 'Test Entity',
        someDate: new Date('2024-01-01T12:00:00.000Z'),
        customField: 'Custom Value',
      };

      const result = testRepo.testMapToDb(data);

      expect(result).toEqual({
        test_name: 'Test Entity',
        some_date: new Date('2024-01-01T12:00:00.000Z'),
        custom_field: 'Custom Value', // Uses fieldMap override
      });
    });

    it('should use custom fieldMap overrides', () => {
      const data = {
        customField: 'Overridden Value',
        testName: 'Regular Field',
      };

      const result = testRepo.testMapToDb(data);

      expect(result.custom_field).toBe('Overridden Value');
      expect(result.test_name).toBe('Regular Field');
    });

    it('should stringify objects and arrays to JSON', () => {
      const data = {
        testName: 'JSON Test',
        metadata: { key: 'value', nested: { array: [1, 2, 3] } },
        tags: ['tag1', 'tag2'],
      };

      const result = testRepo.testMapToDb(data);

      expect(result.metadata).toBe('{"key":"value","nested":{"array":[1,2,3]}}');
      expect(result.tags).toBe('["tag1","tag2"]');
      expect(result.test_name).toBe('JSON Test');
    });

    it('should skip undefined values', () => {
      const data = {
        testName: 'Defined',
        undefinedField: undefined,
        nullField: null,
        emptyString: '',
      };

      const result = testRepo.testMapToDb(data);

      expect(result.test_name).toBe('Defined');
      expect(result.undefined_field).toBeUndefined();
      expect(result.null_field).toBe(null);
      expect(result.empty_string).toBe('');
    });

    it('should preserve Date objects as-is', () => {
      const date = new Date('2024-01-01T12:00:00.000Z');
      const data = {
        someDate: date,
      };

      const result = testRepo.testMapToDb(data);

      expect(result.some_date).toBe(date);
      expect(result.some_date).toBeInstanceOf(Date);
    });
  });

  describe('CRUD Operations', () => {
    describe('findById', () => {
      it('should return entity when ID exists', async () => {
        const mockRow = {
          id: 'test-1',
          test_name: 'Test Entity',
          some_date: new Date('2024-01-01T12:00:00.000Z'),
          created_at: new Date('2024-01-01T10:00:00.000Z'),
          updated_at: new Date('2024-01-01T11:00:00.000Z'),
        };

        mockQuery.mockResolvedValue({ rows: [mockRow] });

        const result = await testRepo.findById('test-1');

        expect(mockQuery).toHaveBeenCalledWith(
          'SELECT * FROM test_entities WHERE id = $1 AND deleted_at IS NULL',
          ['test-1']
        );
        expect(result).toEqual({
          id: 'test-1',
          testName: 'Test Entity',
          someDate: new Date('2024-01-01T12:00:00.000Z'),
          createdAt: new Date('2024-01-01T10:00:00.000Z'),
          updatedAt: new Date('2024-01-01T11:00:00.000Z'),
        });
      });

      it('should add soft-delete clause when softDelete is enabled', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        await testRepo.findById('test-1');

        expect(mockQuery).toHaveBeenCalledWith(
          'SELECT * FROM test_entities WHERE id = $1 AND deleted_at IS NULL',
          ['test-1']
        );
      });

      it('should skip soft-delete clause when withDeleted option is true', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        await testRepo.findById('test-1', { withDeleted: true });

        expect(mockQuery).toHaveBeenCalledWith(
          'SELECT * FROM test_entities WHERE id = $1',
          ['test-1']
        );
      });

      it('should return null when ID does not exist', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        const result = await testRepo.findById('non-existent');

        expect(result).toBeNull();
      });
    });

    describe('create', () => {
      it('should insert entity and return mapped result', async () => {
        const createData = {
          testName: 'New Entity',
          someDate: new Date('2024-01-01T12:00:00.000Z'),
          customField: 'Custom Value',
        };

        const mockRow = {
          id: 'new-id',
          test_name: 'New Entity',
          some_date: new Date('2024-01-01T12:00:00.000Z'),
          custom_field: 'Custom Value',
          created_at: new Date('2024-01-01T13:00:00.000Z'),
          updated_at: new Date('2024-01-01T13:00:00.000Z'),
        };

        mockQuery.mockResolvedValue({ rows: [mockRow] });

        const result = await testRepo.create(createData);

        // Verify SQL generation with placeholders
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringMatching(/INSERT INTO test_entities\s*\(test_name,\s*some_date,\s*custom_field\)\s*VALUES\s*\(\$1,\s*\$2,\s*\$3\)\s*RETURNING\s*\*/),
          ['New Entity', new Date('2024-01-01T12:00:00.000Z'), 'Custom Value']
        );

        expect(result).toEqual({
          id: 'new-id',
          testName: 'New Entity',
          someDate: new Date('2024-01-01T12:00:00.000Z'),
          customField: 'Custom Value',
          createdAt: new Date('2024-01-01T13:00:00.000Z'),
          updatedAt: new Date('2024-01-01T13:00:00.000Z'),
        });
      });

      it('should include created_by when provided', async () => {
        const createData = {
          testName: 'Entity with creator',
        };

        const mockRow = {
          id: 'new-id',
          test_name: 'Entity with creator',
          created_by: 'user-123',
          created_at: new Date(),
          updated_at: new Date(),
        };

        mockQuery.mockResolvedValue({ rows: [mockRow] });

        await testRepo.create(createData, 'user-123');

        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringMatching(/INSERT INTO test_entities\s*\(test_name,\s*created_by\)\s*VALUES\s*\(\$1,\s*\$2\)\s*RETURNING\s*\*/),
          ['Entity with creator', 'user-123']
        );
      });
    });

    describe('update', () => {
      it('should update entity and return mapped result', async () => {
        const updateData = {
          testName: 'Updated Entity',
          customField: 'Updated Custom Value',
        };

        const mockRow = {
          id: 'test-1',
          test_name: 'Updated Entity',
          custom_field: 'Updated Custom Value',
          some_date: new Date('2024-01-01T12:00:00.000Z'),
          created_at: new Date('2024-01-01T10:00:00.000Z'),
          updated_at: new Date('2024-01-01T14:00:00.000Z'),
        };

        mockQuery.mockResolvedValue({ rows: [mockRow] });

        const result = await testRepo.update('test-1', updateData);

        // Verify SQL generation with set clauses
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringMatching(/UPDATE test_entities SET test_name = \$1, custom_field = \$2 WHERE id = \$3 AND deleted_at IS NULL RETURNING \*/),
          ['Updated Entity', 'Updated Custom Value', 'test-1']
        );

        expect(result).toEqual({
          id: 'test-1',
          testName: 'Updated Entity',
          customField: 'Updated Custom Value',
          someDate: new Date('2024-01-01T12:00:00.000Z'),
          createdAt: new Date('2024-01-01T10:00:00.000Z'),
          updatedAt: new Date('2024-01-01T14:00:00.000Z'),
        });
      });

      it('should add soft-delete clause when softDelete is enabled', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        await testRepo.update('test-1', { testName: 'Updated' });

        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE test_entities SET test_name = $1 WHERE id = $2 AND deleted_at IS NULL RETURNING *'),
          ['Updated', 'test-1']
        );
      });

      it('should return null if entity not found during update', async () => {
        mockQuery.mockResolvedValue({ rows: [] });

        const result = await testRepo.update('non-existent', { testName: 'Updated' });

        expect(result).toBeNull();
      });

      it('should call findById if update payload is empty', async () => {
        const mockRow = {
          id: 'test-1',
          test_name: 'Existing Entity',
          created_at: new Date(),
          updated_at: new Date(),
        };

        mockQuery.mockResolvedValue({ rows: [mockRow] });

        const result = await testRepo.update('test-1', {});

        // Should call findById (which has soft-delete clause)
        expect(mockQuery).toHaveBeenCalledWith(
          'SELECT * FROM test_entities WHERE id = $1 AND deleted_at IS NULL',
          ['test-1']
        );
        expect(result).not.toBeNull();
      });
    });

    describe('delete', () => {
      it('should perform soft delete when softDelete is enabled', async () => {
        mockQuery.mockResolvedValue({ rowCount: 1 });

        const result = await testRepo.delete('test-1');

        expect(mockQuery).toHaveBeenCalledWith(
          'UPDATE test_entities SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL',
          ['test-1']
        );
        expect(result).toBe(true);
      });

      it('should perform hard delete when softDelete is disabled', async () => {
        const hardDeleteConfig: RepositoryConfig = {
          tableName: 'test_entities',
          softDelete: false,
        };
        const hardDeleteRepo = new TestRepository(hardDeleteConfig);

        mockQuery.mockResolvedValue({ rowCount: 1 });

        const result = await hardDeleteRepo.delete('test-1');

        expect(mockQuery).toHaveBeenCalledWith(
          'DELETE FROM test_entities WHERE id = $1',
          ['test-1']
        );
        expect(result).toBe(true);
      });

      it('should return false when no rows are affected', async () => {
        mockQuery.mockResolvedValue({ rowCount: 0 });

        const result = await testRepo.delete('non-existent');

        expect(result).toBe(false);
      });
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should delegate to queryBuilder and return paginated results', async () => {
      const mockRows = [
        {
          id: 'test-1',
          test_name: 'Test Entity 1',
          created_at: new Date('2024-01-01T10:00:00.000Z'),
          updated_at: new Date('2024-01-01T11:00:00.000Z'),
          full_count: 2,
        },
        {
          id: 'test-2',
          test_name: 'Test Entity 2',
          created_at: new Date('2024-01-02T10:00:00.000Z'),
          updated_at: new Date('2024-01-02T11:00:00.000Z'),
          full_count: 2,
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const filters = {
        limit: 10,
        page: 1,
        sortBy: 'created_at',
        sortOrder: 'DESC' as const,
      };

      const result = await testRepo.findAll(filters);

      // Verify queryBuilder was called via the actual SQL
      expect(mockQuery).toHaveBeenCalledTimes(1);
      const [sql, values] = mockQuery.mock.calls[0];
      
      // Should include soft-delete clause (softDelete is true)
      expect(sql).toContain('SELECT *, COUNT(*) OVER() as full_count FROM test_entities');
      expect(sql).toContain('deleted_at IS NULL');
      expect(sql).toContain('ORDER BY created_at DESC');
      expect(sql).toContain('LIMIT $');
      expect(sql).toContain('OFFSET $');
      
      // Verify pagination values
      expect(values).toEqual([10, 0]); // limit=10, offset=0 (page-1)*limit

      // Verify mapped results
      expect(result.total).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0]).toEqual({
        id: 'test-1',
        testName: 'Test Entity 1',
        createdAt: new Date('2024-01-01T10:00:00.000Z'),
        updatedAt: new Date('2024-01-01T11:00:00.000Z'),
      });
    });

    it('should extract total from full_count column', async () => {
      const mockRows = [
        {
          id: 'test-1',
          test_name: 'Test Entity',
          created_at: new Date(),
          updated_at: new Date(),
          full_count: 42,
        },
      ];

      mockQuery.mockResolvedValue({ rows: mockRows });

      const result = await testRepo.findAll({});

      expect(mockQuery).toHaveBeenCalledTimes(1);
      expect(result.total).toBe(42);
      expect(result.data[0]).not.toHaveProperty('full_count');
      expect(result.data[0]).not.toHaveProperty('fullCount');
    });

    it('should handle empty result set', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await testRepo.findAll({});

      expect(result.total).toBe(0);
      expect(result.data).toEqual([]);
    });

    it('should use default sort when sortBy is not allowed', async () => {
      mockQuery.mockResolvedValue({ rows: [] });

      await testRepo.findAll({ sortBy: 'invalid_field', sortOrder: 'ASC' });

      const [sql] = mockQuery.mock.calls[0];
      
      // Should fall back to default sortBy (created_at) but keep provided sortOrder (ASC)
      expect(sql).toContain('ORDER BY created_at ASC');
    });

    it('should use custom buildWhereClause for filtering', async () => {
      // Create a test repository with custom buildWhereClause
      const CustomRepository = class extends BaseRepository<TestEntity> {
        protected buildWhereClause(key: string, value: unknown, paramCount: number) {
          if (key === 'customField') {
            return {
              sql: `${this.dataMapper.fieldMap[key] || key} ILIKE $${paramCount}`,
              value: `%${value}%`
            };
          }
          return null; // Use default
        }
      };

      const customRepo = new CustomRepository({
        tableName: 'test_entities',
        softDelete: true,
        allowedFilterFields: ['customField'],
        fieldMap: { customField: 'custom_field' },
      });

      mockQuery.mockResolvedValue({ rows: [] });

      await customRepo.findAll({ customField: 'search' });

      const [sql, values] = mockQuery.mock.calls[0];
      
      expect(sql).toContain('custom_field ILIKE $');
      expect(values).toContain('%search%');
    });

    it('should respect allowedSortFields', async () => {
      // Create a test repository with specific allowed sort fields
      const SortRepository = class extends BaseRepository<TestEntity> {};
      const sortRepo = new SortRepository({
        tableName: 'test_entities',
        softDelete: true,
        allowedSortFields: ['updated_at', 'test_name'],
        defaultSortBy: 'updated_at',
      });

      mockQuery.mockResolvedValue({ rows: [] });

      // Try to sort by allowed field
      await sortRepo.findAll({ sortBy: 'test_name', sortOrder: 'ASC' });
      let [sql] = mockQuery.mock.calls[0];
      expect(sql).toContain('ORDER BY test_name ASC');

      vi.clearAllMocks();
      mockQuery.mockResolvedValue({ rows: [] });

      // Try to sort by disallowed field - should fall back to default
      await sortRepo.findAll({ sortBy: 'created_at', sortOrder: 'DESC' });
      [sql] = mockQuery.mock.calls[0];
      expect(sql).toContain('ORDER BY updated_at DESC'); // default
    });
  });
});