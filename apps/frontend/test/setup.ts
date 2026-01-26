import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset any request handlers that are declared in a test
afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
});

// Clean up after all tests are done
afterAll(() => {
  server.close();
});
