import api from './api';
export const vehiclesService = {
    async getAll(filters) {
        const params = new URLSearchParams();
        if (filters?.make)
            params.append('make', filters.make);
        if (filters?.model)
            params.append('model', filters.model);
        if (filters?.yearMin)
            params.append('yearMin', filters.yearMin.toString());
        if (filters?.yearMax)
            params.append('yearMax', filters.yearMax.toString());
        if (filters?.priceMin)
            params.append('priceMin', filters.priceMin.toString());
        if (filters?.priceMax)
            params.append('priceMax', filters.priceMax.toString());
        if (filters?.status)
            params.append('status', filters.status);
        if (filters?.condition)
            params.append('condition', filters.condition);
        if (filters?.search)
            params.append('search', filters.search);
        if (filters?.page)
            params.append('page', filters.page.toString());
        if (filters?.limit)
            params.append('limit', filters.limit.toString());
        const response = await api.get(`/vehicles?${params.toString()}`);
        return response.data;
    },
    async getById(id) {
        const response = await api.get(`/vehicles/${id}`);
        return response.data.data;
    },
    async create(data) {
        const response = await api.post('/vehicles', data);
        return response.data.data;
    },
    async update(id, data) {
        const response = await api.put(`/vehicles/${id}`, data);
        return response.data.data;
    },
    async delete(id) {
        await api.delete(`/vehicles/${id}`);
    },
    async getStats() {
        const response = await api.get('/vehicles/stats');
        return response.data.data;
    },
    async getRecent(limit = 5) {
        const response = await api.get(`/vehicles/recent?limit=${limit}`);
        return response.data.data;
    },
};
//# sourceMappingURL=vehicles.service.js.map