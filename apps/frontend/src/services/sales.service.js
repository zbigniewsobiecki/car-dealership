import api from './api';
export const salesService = {
    async getAll() {
        const response = await api.get('/sales');
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/sales/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/sales', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/sales/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/sales/${id}`);
    },
    async getStats() {
        const response = await api.get('/sales/stats');
        return response.data.data;
    },
    async getMonthlyStats() {
        const response = await api.get('/sales/stats/monthly');
        return response.data.data;
    },
};
//# sourceMappingURL=sales.service.js.map