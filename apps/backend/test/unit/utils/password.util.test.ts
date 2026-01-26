import { describe, it, expect } from 'vitest';
import { passwordUtils } from '../../../src/utils/password.util.js';

describe('passwordUtils', () => {
  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await passwordUtils.hash(password);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash).not.toBe(password);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await passwordUtils.hash(password);
      const hash2 = await passwordUtils.hash(password);

      // bcrypt uses random salt, so hashes should be different
      expect(hash1).not.toBe(hash2);
    });

    it('should produce hash with bcrypt format', async () => {
      const password = 'testPassword123';
      const hash = await passwordUtils.hash(password);

      // bcrypt hashes start with $2a$ or $2b$
      expect(hash.startsWith('$2')).toBe(true);
    });

    it('should handle empty password', async () => {
      const hash = await passwordUtils.hash('');

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
    });

    it('should handle special characters', async () => {
      const password = 'p@ssw0rd!#$%^&*()';
      const hash = await passwordUtils.hash(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it('should handle very long passwords', async () => {
      const password = 'a'.repeat(100);
      const hash = await passwordUtils.hash(password);

      expect(hash).toBeDefined();
    });
  });

  describe('compare', () => {
    it('should return true for matching password', async () => {
      const password = 'testPassword123';
      const hash = await passwordUtils.hash(password);
      const result = await passwordUtils.compare(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hash = await passwordUtils.hash(password);
      const result = await passwordUtils.compare(wrongPassword, hash);

      expect(result).toBe(false);
    });

    it('should return false for similar but different passwords', async () => {
      const password = 'testPassword123';
      const similarPassword = 'testPassword124';
      const hash = await passwordUtils.hash(password);
      const result = await passwordUtils.compare(similarPassword, hash);

      expect(result).toBe(false);
    });

    it('should handle case sensitivity', async () => {
      const password = 'TestPassword123';
      const lowerPassword = 'testpassword123';
      const hash = await passwordUtils.hash(password);
      const result = await passwordUtils.compare(lowerPassword, hash);

      expect(result).toBe(false);
    });

    it('should handle empty password comparison', async () => {
      const hash = await passwordUtils.hash('');
      const result = await passwordUtils.compare('', hash);

      expect(result).toBe(true);
    });

    it('should handle special characters comparison', async () => {
      const password = 'p@ssw0rd!#$%^&*()';
      const hash = await passwordUtils.hash(password);
      const result = await passwordUtils.compare(password, hash);

      expect(result).toBe(true);
    });
  });
});
