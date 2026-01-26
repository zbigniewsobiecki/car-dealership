import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from '../../../src/services/api';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:3000/api';

describe('api service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('base configuration', () => {
    it('should have correct baseURL', () => {
      expect(api.defaults.baseURL).toBeDefined();
    });

    it('should have JSON content type', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });
  });

  describe('request interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');

      // Set up a handler to capture the request
      let capturedAuthHeader: string | null = null;
      server.use(
        http.get(`${API_URL}/test`, ({ request }) => {
          capturedAuthHeader = request.headers.get('Authorization');
          return HttpResponse.json({ success: true });
        })
      );

      await api.get('/test');

      expect(capturedAuthHeader).toBe('Bearer test-token');
    });

    it('should not add Authorization header when no token', async () => {
      localStorage.removeItem('token');

      let capturedAuthHeader: string | null = null;
      server.use(
        http.get(`${API_URL}/test`, ({ request }) => {
          capturedAuthHeader = request.headers.get('Authorization');
          return HttpResponse.json({ success: true });
        })
      );

      await api.get('/test');

      expect(capturedAuthHeader).toBeNull();
    });
  });

  describe('response interceptor', () => {
    it('should return response on success', async () => {
      server.use(
        http.get(`${API_URL}/test-success`, () => {
          return HttpResponse.json({ success: true, data: { message: 'test' } });
        })
      );

      const response = await api.get('/test-success');

      expect(response.data.success).toBe(true);
    });

    it('should reject on error', async () => {
      server.use(
        http.get(`${API_URL}/test-error`, () => {
          return HttpResponse.json(
            { success: false, error: { message: 'Test error' } },
            { status: 400 }
          );
        })
      );

      await expect(api.get('/test-error')).rejects.toThrow();
    });
  });
});
