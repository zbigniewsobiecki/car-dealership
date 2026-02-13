import { describe, it, expect } from 'vitest';
import { buildSelectQuery, type QueryBuilderOptions } from '../../../src/utils/queryBuilder.js';

describe('buildSelectQuery', () => {
  const baseOptions: QueryBuilderOptions = {
    tableName: 'vehicles',
    allowedFilterFields: ['make', 'model', 'year', 'status', 'price'],
  };

  const baseSort = {
    sortBy: 'created_at',
    sortOrder: 'DESC' as const,
  };

  describe('basic SELECT and soft delete', () => {
    it('should generate basic SELECT query with COUNT(*) OVER()', () => {
      const result = buildSelectQuery(baseOptions, {}, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles ORDER BY created_at DESC');
      expect(result.values).toEqual([]);
    });

    it('should add soft delete clause when softDelete is true', () => {
      const options: QueryBuilderOptions = {
        ...baseOptions,
        softDelete: true,
      };

      const result = buildSelectQuery(options, {}, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE deleted_at IS NULL ORDER BY created_at DESC');
      expect(result.values).toEqual([]);
    });

    it('should not add soft delete clause when softDelete is false', () => {
      const options: QueryBuilderOptions = {
        ...baseOptions,
        softDelete: false,
      };

      const result = buildSelectQuery(options, {}, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles ORDER BY created_at DESC');
      expect(result.values).toEqual([]);
    });

    it('should not add soft delete clause when softDelete is undefined', () => {
      const options: QueryBuilderOptions = {
        ...baseOptions,
        // softDelete is undefined
      };

      const result = buildSelectQuery(options, {}, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles ORDER BY created_at DESC');
      expect(result.values).toEqual([]);
    });
  });

  describe('filter mapping (camelCase to snake_case and fieldMap)', () => {
    it('should ignore filters not in allowedFilterFields', () => {
      const filters = {
        make: 'Toyota',
        model: 'Camry',
        invalidField: 'should be ignored',
        anotherInvalid: 123,
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND model = $2 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 'Camry']);
    });

    it('should ignore null and undefined filter values', () => {
      const filters = {
        make: 'Toyota',
        model: null,
        year: undefined,
        status: 'available',
        price: 0, // 0 should be included
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND status = $2 AND price = $3 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 'available', 0]);
    });

    it('should convert camelCase to snake_case automatically', () => {
      const filters = {
        make: 'Toyota',
        vehicleType: 'sedan', // camelCase field not in allowedFilterFields
      };

      const options: QueryBuilderOptions = {
        ...baseOptions,
        allowedFilterFields: ['make', 'vehicleType'], // Add vehicleType to allowed fields
      };

      const result = buildSelectQuery(options, filters, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND vehicle_type = $2 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 'sedan']);
    });

    it('should use fieldMap when provided', () => {
      const filters = {
        make: 'Toyota',
        model: 'Camry',
      };

      const options: QueryBuilderOptions = {
        ...baseOptions,
        fieldMap: {
          make: 'brand', // Map 'make' to 'brand' column
          model: 'model_name', // Map 'model' to 'model_name' column
        },
      };

      const result = buildSelectQuery(options, filters, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE brand = $1 AND model_name = $2 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 'Camry']);
    });

    it('should prioritize fieldMap over automatic snake_case conversion', () => {
      const filters = {
        vehicleType: 'sedan',
        engineSize: 2.5,
      };

      const options: QueryBuilderOptions = {
        tableName: 'vehicles',
        allowedFilterFields: ['vehicleType', 'engineSize'],
        fieldMap: {
          vehicleType: 'type', // Explicit mapping
          // engineSize will use automatic conversion
        },
      };

      const result = buildSelectQuery(options, filters, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE type = $1 AND engine_size = $2 ORDER BY created_at DESC');
      expect(result.values).toEqual(['sedan', 2.5]);
    });

    it('should handle multiple camelCase conversions correctly', () => {
      const filters = {
        make: 'Toyota',
        modelYear: 2023,
        isElectric: true,
        hasSunroof: false,
      };

      const options: QueryBuilderOptions = {
        tableName: 'vehicles',
        allowedFilterFields: ['make', 'modelYear', 'isElectric', 'hasSunroof'],
      };

      const result = buildSelectQuery(options, filters, baseSort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND model_year = $2 AND is_electric = $3 AND has_sunroof = $4 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 2023, true, false]);
    });
  });

  describe('pagination and parameter indexing', () => {
    it('should add LIMIT and OFFSET with correct parameter indices when no filters', () => {
      const pagination = {
        limit: 10,
        offset: 20,
      };

      const result = buildSelectQuery(baseOptions, {}, baseSort, pagination);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles ORDER BY created_at DESC LIMIT $1 OFFSET $2');
      expect(result.values).toEqual([10, 20]);
    });

    it('should add LIMIT and OFFSET with correct parameter indices after filters', () => {
      const filters = {
        make: 'Toyota',
        status: 'available',
      };

      const pagination = {
        limit: 10,
        offset: 0,
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort, pagination);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4');
      expect(result.values).toEqual(['Toyota', 'available', 10, 0]);
    });

    it('should handle pagination with soft delete', () => {
      const options: QueryBuilderOptions = {
        ...baseOptions,
        softDelete: true,
      };

      const filters = {
        make: 'Toyota',
      };

      const pagination = {
        limit: 5,
        offset: 10,
      };

      const result = buildSelectQuery(options, filters, baseSort, pagination);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE deleted_at IS NULL AND make = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3');
      expect(result.values).toEqual(['Toyota', 5, 10]);
    });

    it('should handle sorting with different sortBy and sortOrder', () => {
      const sort = {
        sortBy: 'price',
        sortOrder: 'ASC' as const,
      };

      const result = buildSelectQuery(baseOptions, {}, sort);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles ORDER BY price ASC');
      expect(result.values).toEqual([]);
    });

    it('should handle complex parameter indexing with multiple filters and pagination', () => {
      const filters = {
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        status: 'available',
        price: 25000,
      };

      const pagination = {
        limit: 25,
        offset: 50,
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort, pagination);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND model = $2 AND year = $3 AND status = $4 AND price = $5 ORDER BY created_at DESC LIMIT $6 OFFSET $7');
      expect(result.values).toEqual(['Toyota', 'Camry', 2023, 'available', 25000, 25, 50]);
    });
  });

  describe('customWhereBuilder', () => {
    it('should use customWhereBuilder when provided', () => {
      const filters = {
        make: 'Toyota',
        year: 2023,
      };

      const customWhereBuilder = (key: string, value: unknown, paramCount: number) => {
        if (key === 'year') {
          return {
            sql: `year >= $${paramCount} AND year <= $${paramCount + 1}`,
            value: [2020, 2025], // Range filter
          };
        }
        return null; // Let default builder handle other keys
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort, undefined, customWhereBuilder);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND year >= $2 AND year <= $3 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 2020, 2025]);
    });

    it('should handle custom builder returning single value', () => {
      const filters = {
        make: 'Toyota',
        model: 'Camry',
      };

      const customWhereBuilder = (key: string, value: unknown, paramCount: number) => {
        if (key === 'model') {
          return {
            sql: `model ILIKE $${paramCount}`,
            value: `%${value}%`, // Wrap in wildcards for ILIKE search
          };
        }
        return null;
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort, undefined, customWhereBuilder);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND model ILIKE $2 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', '%Camry%']);
    });

    it('should handle custom builder returning array values', () => {
      const filters = {
        status: 'available',
        year: 2023,
      };

      const customWhereBuilder = (key: string, value: unknown, paramCount: number) => {
        if (key === 'year') {
          return {
            sql: `year IN ($${paramCount}, $${paramCount + 1}, $${paramCount + 2})`,
            value: [2022, 2023, 2024], // Multiple values
          };
        }
        return null;
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort, undefined, customWhereBuilder);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE status = $1 AND year IN ($2, $3, $4) ORDER BY created_at DESC');
      expect(result.values).toEqual(['available', 2022, 2023, 2024]);
    });

    it('should update paramCount correctly for array values from custom builder', () => {
      const filters = {
        make: 'Toyota',
        years: [2022, 2023, 2024], // This will be handled by custom builder
      };

      const options: QueryBuilderOptions = {
        tableName: 'vehicles',
        allowedFilterFields: ['make', 'years'],
      };

      const customWhereBuilder = (key: string, value: unknown, paramCount: number) => {
        if (key === 'years' && Array.isArray(value)) {
          const placeholders = value.map((_, i) => `$${paramCount + i}`).join(', ');
          return {
            sql: `year IN (${placeholders})`,
            value,
          };
        }
        return null;
      };

      const result = buildSelectQuery(options, filters, baseSort, undefined, customWhereBuilder);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND year IN ($2, $3, $4) ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 2022, 2023, 2024]);
    });

    it('should combine custom builder with default builder for different fields', () => {
      const filters = {
        make: 'Toyota',
        model: 'Camry',
        price: 25000,
      };

      const customWhereBuilder = (key: string, value: unknown, paramCount: number) => {
        if (key === 'price') {
          return {
            sql: `price BETWEEN $${paramCount} AND $${paramCount + 1}`,
            value: [value, (value as number) + 5000], // Price range
          };
        }
        return null;
      };

      const result = buildSelectQuery(baseOptions, filters, baseSort, undefined, customWhereBuilder);

      expect(result.sql).toBe('SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE make = $1 AND model = $2 AND price BETWEEN $3 AND $4 ORDER BY created_at DESC');
      expect(result.values).toEqual(['Toyota', 'Camry', 25000, 30000]);
    });
  });
});