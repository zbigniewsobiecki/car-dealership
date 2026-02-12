import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// We need to mock env BEFORE importing app

vi.mock('../../src/config/env.js', () => ({
  env: {
    nodeEnv: 'test',
    cors: { 
      // This will be overridden in tests if needed, but we'll use a dynamic approach
      // since vitest mocks are hoisted. For integration tests of the middleware
      // we might need to re-import or use a setter if the app uses it directly.
      // However, app.ts uses env.cors.origin at initialization.
      origin: ['http://allowed1.com', 'http://allowed2.com']
    },
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h',
      refreshSecret: 'test-refresh-secret',
      refreshExpiresIn: '7d',
    },
  },
}));

// Mock database to avoid connection issues
vi.mock('../../src/models/db.js', () => ({
  query: vi.fn(),
  dbUtils: {
    testConnection: vi.fn().mockResolvedValue(true),
  },
}));

// Import app after mocking
const { default: app } = await import('../../src/app.js');

describe('CORS Integration', () => {
  describe('Allowed Origins', () => {
    it('should allow request from first allowed origin', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://allowed1.com');

      expect(response.headers['access-control-allow-origin']).toBe('http://allowed1.com');
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should allow request from second allowed origin', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://allowed2.com');

      expect(response.headers['access-control-allow-origin']).toBe('http://allowed2.com');
    });

    it('should handle OPTIONS preflight request for allowed origin', async () => {
      const response = await request(app)
        .options('/health')
        .set('Origin', 'http://allowed1.com')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.status).toBe(204);
      expect(response.headers['access-control-allow-origin']).toBe('http://allowed1.com');
    });
  });

  describe('Disallowed Origins', () => {
    it('should not allow request from disallowed origin', async () => {
      const response = await request(app)
        .get('/health')
        .set('Origin', 'http://disallowed.com');

      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });
});