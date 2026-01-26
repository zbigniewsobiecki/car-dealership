import { vi } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';

// Mock the database module
vi.mock('../src/models/db.js', () => ({
  query: vi.fn(),
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}));
