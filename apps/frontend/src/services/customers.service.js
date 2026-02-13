import api from './api';
export const customersService = {
    async getAll() {
        const response = await api.get('/customers');
        return response.data.data;
    },
    async getById(id) {
        const response = await api.get(`/customers/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/customers', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/customers/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/customers/${id}`);
    },
    async getSales(id) {
        const response = await api.get(`/customers/${id}/sales`);
        return response.data.data;
    },
};
//# sourceMappingURL=customers.service.js.map