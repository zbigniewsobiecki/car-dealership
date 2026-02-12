import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';

// Mock environment config
vi.mock('../../src/config/env.js', () => ({
  env: {
    nodeEnv: 'test',
    cors: { origin: '*' },
    jwt: {
      secret: 'test-secret',
      expiresIn: '1h',
      refreshSecret: 'test-refresh-secret',
      refreshExpiresIn: '7d',
    },
  },
}));

// Mock jwt config
vi.mock('../../src/config/jwt.js', () => ({
  jwtConfig: {
    secret: 'test-secret',
    expiresIn: '1h',
    refreshSecret: 'test-refresh-secret',
    refreshExpiresIn: '7d',
  },
}));

// Mock database
const mockQuery = vi.fn();
vi.mock('../../src/models/db.js', () => ({
  query: (...args: unknown[]) => mockQuery(...args),
  dbUtils: {
    testConnection: vi.fn(),
  },
}));

// Import app after mocking
const { default: app } = await import('../../src/app.js');
const { dbUtils } = await import('../../src/models/db.js');

describe('Health Routes Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return 200 OK when database is up', async () => {
      vi.mocked(dbUtils.testConnection).mockResolvedValueOnce(true);

      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
      expect(response.body.services.database).toBe('up');
    });

    it('should return 503 Service Unavailable when database is down', async () => {
      vi.mocked(dbUtils.testConnection).mockResolvedValueOnce(false);

      const response = await request(app).get('/health');

      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
      expect(response.body.services.database).toBe('down');
    });
  });
});