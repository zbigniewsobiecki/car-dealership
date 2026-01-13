import api from './api';
import { AuthResponse, LoginRequest } from '@car-dealership/shared-types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  async logout() {
    // No backend call needed, just clear local storage
    return Promise.resolve();
  },
};
