import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the db module
const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}));

vi.mock('../../../src/models/db.js', () => ({
  query: mockQuery,
}));

// Import CustomerModel after mocking db
import { CustomerModel } from '../../../src/models/Customer.model.js';

describe('CustomerModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('hardDelete', () => {
    it('should return true when deletion is successful', async () => {
      mockQuery.mockResolvedValue({ rowCount: 1 });

      const result = await CustomerModel.hardDelete('customer-1');

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM customers WHERE id = $1',
        ['customer-1']
      );
      expect(result).toBe(true);
    });

    it('should return false when no rows are deleted', async () => {
      mockQuery.mockResolvedValue({ rowCount: 0 });

      const result = await CustomerModel.hardDelete('non-existent');

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM customers WHERE id = $1',
        ['non-existent']
      );
      expect(result).toBe(false);
    });
  });

  // Test inheritance from BaseRepository
  describe('inheritance from BaseRepository', () => {
    it('should have BaseRepository methods', () => {
      // Check that CustomerModel has methods from BaseRepository
      expect(typeof CustomerModel.findById).toBe('function');
      expect(typeof CustomerModel.create).toBe('function');
      expect(typeof CustomerModel.update).toBe('function');
      expect(typeof CustomerModel.delete).toBe('function');
      expect(typeof CustomerModel.findAll).toBe('function');
    });
  });
});