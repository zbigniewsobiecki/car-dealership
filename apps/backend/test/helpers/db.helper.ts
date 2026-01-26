import { vi } from 'vitest';

// Create a mock query function that can be configured per test
export const createMockQuery = () => {
  return vi.fn();
};

// Reset database mocks between tests
export const resetDbMocks = () => {
  vi.clearAllMocks();
};
