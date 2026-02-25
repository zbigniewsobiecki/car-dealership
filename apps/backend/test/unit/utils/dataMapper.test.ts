import { describe, it, expect, beforeEach } from 'vitest';
import { DataMapper } from '../../../src/utils/dataMapper.js';

describe('DataMapper', () => {
  describe('constructor and field mapping', () => {
    it('should initialize with empty fieldMap when not provided', () => {
      const mapper = new DataMapper();

      expect(mapper.fieldMap).toEqual({});
      expect(mapper.reverseFieldMap).toEqual({});
    });

    it('should initialize with provided fieldMap', () => {
      const mapper = new DataMapper({
        fieldMap: {
          firstName: 'first_name',
          lastName: 'last_name',
        },
      });

      expect(mapper.fieldMap).toEqual({
        firstName: 'first_name',
        lastName: 'last_name',
      });
    });

    it('should create reverseFieldMap from fieldMap', () => {
      const mapper = new DataMapper({
        fieldMap: {
          firstName: 'first_name',
          lastName: 'last_name',
          userId: 'user_id',
        },
      });

      expect(mapper.reverseFieldMap).toEqual({
        first_name: 'firstName',
        last_name: 'lastName',
        user_id: 'userId',
      });
    });
  });

  describe('mapRow() - Database to Entity', () => {
    it('should convert snake_case database row to camelCase entity', () => {
      const mapper = new DataMapper();
      const row = {
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: expect.any(Date),
      });
    });

    it('should use reverseFieldMap when provided', () => {
      const mapper = new DataMapper({
        fieldMap: {
          userEmail: 'email_address',
          phoneNum: 'phone_number',
        },
      });

      const row = {
        email_address: 'john@example.com',
        phone_number: '555-1234',
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        userEmail: 'john@example.com',
        phoneNum: '555-1234',
      });
    });

    it('should skip full_count field from database rows', () => {
      const mapper = new DataMapper();
      const row = {
        id: '123',
        name: 'Test',
        full_count: '100',
      };

      const result = mapper.mapRow(row);

      expect(result).not.toHaveProperty('full_count');
      expect(result).not.toHaveProperty('fullCount');
      expect(result).toEqual({
        id: '123',
        name: 'Test',
      });
    });

    it('should convert ISO date strings to Date objects', () => {
      const mapper = new DataMapper();
      const row = {
        created_at: '2024-01-15T10:30:00.000Z',
        updated_at: '2024-02-20T14:45:30.500Z',
      };

      const result = mapper.mapRow<{ createdAt: Date; updatedAt: Date }>(row);

      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(result.createdAt.toISOString()).toBe('2024-01-15T10:30:00.000Z');
      expect(result.updatedAt.toISOString()).toBe('2024-02-20T14:45:30.500Z');
    });

    it('should preserve Date objects without conversion', () => {
      const mapper = new DataMapper();
      const dateObj = new Date('2024-01-15T10:30:00.000Z');
      const row = {
        created_at: dateObj,
      };

      const result = mapper.mapRow<{ createdAt: Date }>(row);

      expect(result.createdAt).toBe(dateObj);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should handle null values correctly', () => {
      const mapper = new DataMapper();
      const row = {
        id: '123',
        optional_field: null,
        required_field: 'value',
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        id: '123',
        optionalField: null,
        requiredField: 'value',
      });
    });

    it('should handle undefined values correctly', () => {
      const mapper = new DataMapper();
      const row = {
        id: '123',
        optional_field: undefined,
        required_field: 'value',
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        id: '123',
        optionalField: undefined,
        requiredField: 'value',
      });
    });

    it('should handle complex snake_case conversions', () => {
      const mapper = new DataMapper();
      const row = {
        user_id: '123',
        first_name: 'John',
        is_active: true,
        has_premium_account: false,
        email_verified_at: null,
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        userId: '123',
        firstName: 'John',
        isActive: true,
        hasPremiumAccount: false,
        emailVerifiedAt: null,
      });
    });

    it('should handle numeric and boolean values', () => {
      const mapper = new DataMapper();
      const row = {
        id: '123',
        age: 25,
        price: 99.99,
        is_active: true,
        is_deleted: false,
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        id: '123',
        age: 25,
        price: 99.99,
        isActive: true,
        isDeleted: false,
      });
    });

    it('should not convert non-date strings that match date pattern', () => {
      const mapper = new DataMapper();
      const row = {
        id: '123',
        regular_string: 'not-a-date',
        number_string: '12345',
      };

      const result = mapper.mapRow(row);

      expect(result).toEqual({
        id: '123',
        regularString: 'not-a-date',
        numberString: '12345',
      });
    });
  });

  describe('mapToDb() - Entity to Database', () => {
    it('should convert camelCase entity to snake_case database record', () => {
      const mapper = new DataMapper();
      const entity = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date('2024-01-01'),
      };

      const result = mapper.mapToDb(entity);

      expect(result).toEqual({
        id: '123',
        first_name: 'John',
        last_name: 'Doe',
        created_at: expect.any(Date),
      });
    });

    it('should use fieldMap when provided', () => {
      const mapper = new DataMapper({
        fieldMap: {
          userEmail: 'email_address',
          phoneNum: 'phone_number',
        },
      });

      const entity = {
        userEmail: 'john@example.com',
        phoneNum: '555-1234',
      };

      const result = mapper.mapToDb(entity);

      expect(result).toEqual({
        email_address: 'john@example.com',
        phone_number: '555-1234',
      });
    });

    it('should skip undefined values', () => {
      const mapper = new DataMapper();
      const entity = {
        id: '123',
        firstName: 'John',
        lastName: undefined,
        age: 25,
      };

      const result = mapper.mapToDb(entity);

      expect(result).not.toHaveProperty('last_name');
      expect(result).toEqual({
        id: '123',
        first_name: 'John',
        age: 25,
      });
    });

    it('should preserve null values', () => {
      const mapper = new DataMapper();
      const entity = {
        id: '123',
        optionalField: null,
        requiredField: 'value',
      };

      const result = mapper.mapToDb(entity);

      expect(result).toEqual({
        id: '123',
        optional_field: null,
        required_field: 'value',
      });
    });

    it('should preserve Date objects without conversion', () => {
      const mapper = new DataMapper();
      const dateObj = new Date('2024-01-15T10:30:00.000Z');
      const entity = {
        createdAt: dateObj,
      };

      const result = mapper.mapToDb(entity);

      expect(result.created_at).toBe(dateObj);
      expect(result.created_at).toBeInstanceOf(Date);
    });

    it('should convert objects to JSON strings', () => {
      const mapper = new DataMapper();
      const entity = {
        id: '123',
        metadata: { key1: 'value1', key2: 'value2' },
        tags: ['tag1', 'tag2', 'tag3'],
      };

      const result = mapper.mapToDb(entity);

      expect(result).toEqual({
        id: '123',
        metadata: '{"key1":"value1","key2":"value2"}',
        tags: '["tag1","tag2","tag3"]',
      });
    });

    it('should not convert Date objects to JSON', () => {
      const mapper = new DataMapper();
      const dateObj = new Date('2024-01-15');
      const entity = {
        id: '123',
        createdAt: dateObj,
      };

      const result = mapper.mapToDb(entity);

      expect(result.created_at).toBe(dateObj);
      expect(result.created_at).not.toBe(JSON.stringify(dateObj));
    });

    it('should handle nested object conversion', () => {
      const mapper = new DataMapper();
      const entity = {
        id: '123',
        config: {
          nested: {
            deep: {
              value: 'test',
            },
          },
        },
      };

      const result = mapper.mapToDb(entity);

      expect(result.config).toBe('{"nested":{"deep":{"value":"test"}}}');
    });

    it('should handle boolean and numeric values', () => {
      const mapper = new DataMapper();
      const entity = {
        id: '123',
        isActive: true,
        count: 42,
        price: 99.99,
      };

      const result = mapper.mapToDb(entity);

      expect(result).toEqual({
        id: '123',
        is_active: true,
        count: 42,
        price: 99.99,
      });
    });

    it('should handle complex camelCase conversions', () => {
      const mapper = new DataMapper();
      const entity = {
        userId: '123',
        firstName: 'John',
        isActive: true,
        hasPremiumAccount: false,
        emailVerifiedAt: null,
      };

      const result = mapper.mapToDb(entity);

      expect(result).toEqual({
        user_id: '123',
        first_name: 'John',
        is_active: true,
        has_premium_account: false,
        email_verified_at: null,
      });
    });
  });

  describe('Static helper methods', () => {
    describe('camelToSnake()', () => {
      it('should convert camelCase to snake_case', () => {
        expect(DataMapper.camelToSnake('firstName')).toBe('first_name');
        expect(DataMapper.camelToSnake('lastName')).toBe('last_name');
        expect(DataMapper.camelToSnake('userId')).toBe('user_id');
      });

      it('should handle multiple capital letters', () => {
        expect(DataMapper.camelToSnake('isActiveUser')).toBe('is_active_user');
        expect(DataMapper.camelToSnake('hasPremiumAccount')).toBe('has_premium_account');
      });

      it('should handle single lowercase word', () => {
        expect(DataMapper.camelToSnake('id')).toBe('id');
        expect(DataMapper.camelToSnake('name')).toBe('name');
      });

      it('should handle strings starting with capital letter', () => {
        expect(DataMapper.camelToSnake('FirstName')).toBe('_first_name');
        expect(DataMapper.camelToSnake('UserId')).toBe('_user_id');
      });

      it('should handle empty string', () => {
        expect(DataMapper.camelToSnake('')).toBe('');
      });

      it('should handle consecutive capitals', () => {
        // Note: The current implementation converts each capital to _lowercase
        // This is expected behavior for simple camelCase conversion
        expect(DataMapper.camelToSnake('HTMLParser')).toBe('_h_t_m_l_parser');
        expect(DataMapper.camelToSnake('HTTPSConnection')).toBe('_h_t_t_p_s_connection');
      });
    });

    describe('snakeToCamel()', () => {
      it('should convert snake_case to camelCase', () => {
        expect(DataMapper.snakeToCamel('first_name')).toBe('firstName');
        expect(DataMapper.snakeToCamel('last_name')).toBe('lastName');
        expect(DataMapper.snakeToCamel('user_id')).toBe('userId');
      });

      it('should handle multiple underscores', () => {
        expect(DataMapper.snakeToCamel('is_active_user')).toBe('isActiveUser');
        expect(DataMapper.snakeToCamel('has_premium_account')).toBe('hasPremiumAccount');
      });

      it('should handle single word without underscores', () => {
        expect(DataMapper.snakeToCamel('id')).toBe('id');
        expect(DataMapper.snakeToCamel('name')).toBe('name');
      });

      it('should handle empty string', () => {
        expect(DataMapper.snakeToCamel('')).toBe('');
      });

      it('should handle consecutive underscores', () => {
        expect(DataMapper.snakeToCamel('first__name')).toBe('first_Name');
      });

      it('should not convert uppercase after underscore', () => {
        expect(DataMapper.snakeToCamel('user_ID')).toBe('user_ID');
      });

      it('should handle long snake_case strings', () => {
        expect(DataMapper.snakeToCamel('this_is_a_very_long_field_name')).toBe('thisIsAVeryLongFieldName');
      });
    });
  });

  describe('Round-trip conversions', () => {
    let mapper: DataMapper;

    beforeEach(() => {
      mapper = new DataMapper({
        fieldMap: {
          userId: 'user_id',
          firstName: 'first_name',
        },
      });
    });

    it('should maintain data integrity through mapToDb -> mapRow round trip', () => {
      const entity = {
        userId: '123',
        firstName: 'John',
        isActive: true,
      };

      const dbRecord = mapper.mapToDb(entity);
      const result = mapper.mapRow(dbRecord);

      expect(result).toEqual(entity);
    });

    it('should handle complex data through round trip', () => {
      const entity = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
        isActive: true,
        metadata: { key: 'value' },
      };

      const dbRecord = mapper.mapToDb(entity);
      // Note: Objects are stringified, so we need to parse them back
      // This is expected behavior - the database stores JSON as strings
      const result = mapper.mapRow(dbRecord);

      expect(result.id).toBe(entity.id);
      expect(result.firstName).toBe(entity.firstName);
      expect(result.lastName).toBe(entity.lastName);
      expect(result.age).toBe(entity.age);
      expect(result.isActive).toBe(entity.isActive);
      expect(result.metadata).toBe('{"key":"value"}'); // Stored as JSON string
    });
  });
});
