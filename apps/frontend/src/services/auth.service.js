import api from './api';
export const authService = {
    async login(credentials) {
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
//# sourceMappingURL=auth.service.js.map