import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserRole } from '@car-dealership/shared-types';

// Mock the db module
const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../../../src/models/db.js', () => ({
  query: mockQuery,
}));

// Import UserModel after mocking db
import { UserModel } from '../../../src/models/User.model.js';

describe('UserModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findById', () => {
    it('should return user when ID exists', async () => {
      const mockUserRow = {
        id: 'user-1',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.SALES,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUserRow] });

      const result = await UserModel.findById('user-1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        ['user-1']
      );
      expect(result).toEqual({
        id: mockUserRow.id,
        email: mockUserRow.email,
        firstName: mockUserRow.first_name,
        lastName: mockUserRow.last_name,
        role: mockUserRow.role,
        isActive: mockUserRow.is_active,
        createdAt: mockUserRow.created_at,
        updatedAt: mockUserRow.updated_at,
      });
    });

    it('should return null when ID does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return user with password hash when email exists', async () => {
      const mockUserRow = {
        id: 'user-1',
        email: 'test@example.com',
        password_hash: 'hashed-password',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.SALES,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUserRow] });

      const result = await UserModel.findByEmail('test@example.com');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = $1'),
        ['test@example.com']
      );
      expect(result).toEqual({
        id: mockUserRow.id,
        email: mockUserRow.email,
        passwordHash: mockUserRow.password_hash,
        firstName: mockUserRow.first_name,
        lastName: mockUserRow.last_name,
        role: mockUserRow.role,
        isActive: mockUserRow.is_active,
        createdAt: mockUserRow.created_at,
        updatedAt: mockUserRow.updated_at,
      });
    });

    it('should return null when email does not exist', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.findByEmail('non-existent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const userData = {
        email: 'new@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Jane',
        lastName: 'Doe',
        role: UserRole.ADMIN,
      };

      const mockCreatedRow = {
        id: 'user-2',
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockCreatedRow] });

      const result = await UserModel.create(userData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        [userData.email, userData.passwordHash, userData.firstName, userData.lastName, userData.role]
      );
      expect(result).toEqual({
        id: mockCreatedRow.id,
        email: mockCreatedRow.email,
        firstName: mockCreatedRow.first_name,
        lastName: mockCreatedRow.last_name,
        role: mockCreatedRow.role,
        isActive: mockCreatedRow.is_active,
        createdAt: mockCreatedRow.created_at,
        updatedAt: mockCreatedRow.updated_at,
      });
    });
  });

  describe('update', () => {
    it('should update specific fields and return updated user', async () => {
      const updateData = {
        firstName: 'UpdatedName',
        isActive: false,
      };

      const mockUpdatedRow = {
        id: 'user-1',
        email: 'test@example.com',
        first_name: 'UpdatedName',
        last_name: 'Doe',
        role: UserRole.SALES,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockQuery.mockResolvedValueOnce({ rows: [mockUpdatedRow] });

      const result = await UserModel.update('user-1', updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users SET first_name = $1, is_active = $2 WHERE id = $3'),
        ['UpdatedName', false, 'user-1']
      );
      expect(result).toEqual({
        id: mockUpdatedRow.id,
        email: mockUpdatedRow.email,
        firstName: mockUpdatedRow.first_name,
        lastName: mockUpdatedRow.last_name,
        role: mockUpdatedRow.role,
        isActive: mockUpdatedRow.is_active,
        createdAt: mockUpdatedRow.created_at,
        updatedAt: mockUpdatedRow.updated_at,
      });
    });

    it('should return null if user not found during update', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await UserModel.update('non-existent', { firstName: 'Fail' });

      expect(result).toBeNull();
    });

    it('should call findById if no fields are provided for update', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.SALES,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock findById behavior (which calls query)
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: mockUser.id,
          email: mockUser.email,
          first_name: mockUser.firstName,
          last_name: mockUser.lastName,
          role: mockUser.role,
          is_active: mockUser.isActive,
          created_at: mockUser.createdAt,
          updated_at: mockUser.updatedAt,
        }]
      });

      const result = await UserModel.update('user-1', {});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        ['user-1']
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe('delete', () => {
    it('should return true when deletion is successful', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await UserModel.delete('user-1');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users WHERE id = $1'),
        ['user-1']
      );
      expect(result).toBe(true);
    });

    it('should return false when no rows are deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });

      const result = await UserModel.delete('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockRows = [
        {
          id: 'user-1',
          email: 'user1@example.com',
          first_name: 'User',
          last_name: 'One',
          role: UserRole.ADMIN,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'user-2',
          email: 'user2@example.com',
          first_name: 'User',
          last_name: 'Two',
          role: UserRole.SALES,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ];

      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await UserModel.findAll();

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users ORDER BY created_at DESC')
      );
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('user-1');
      expect(result[1].id).toBe('user-2');
    });
  });
});