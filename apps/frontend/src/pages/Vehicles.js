import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle, } from '../hooks/useVehicles';
import { useVehicleFilters } from '../hooks/useVehicleFilters';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Pagination } from '../components/shared/Pagination';
import { VehicleFilterBar } from '../components/vehicles/VehicleFilterBar';
import { Plus } from 'lucide-react';
export const Vehicles = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState();
    const { searchTerm, setSearchTerm, type, setType, priceMin, setPriceMin, priceMax, setPriceMax, page, filters, handleSearch, handlePageChange, handleClear, isFiltered, limit, } = useVehicleFilters();
    const { data: paginatedData, isLoading } = useVehicles(filters);
    const vehicles = paginatedData?.data || [];
    const pagination = paginatedData?.pagination;
    const createMutation = useCreateVehicle();
    const updateMutation = useUpdateVehicle();
    const deleteMutation = useDeleteVehicle();
    const handleCreate = () => {
        setEditingVehicle(undefined);
        setShowForm(true);
    };
    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setShowForm(true);
    };
    const handleDelete = async (vehicle) => {
        if (window.confirm(`Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`)) {
            await deleteMutation.mutateAsync(vehicle.id);
        }
    };
    const handleSubmit = async (data) => {
        try {
            if (editingVehicle) {
                await updateMutation.mutateAsync({ id: editingVehicle.id, data });
            }
            else {
                await createMutation.mutateAsync(data);
            }
            setShowForm(false);
            setEditingVehicle(undefined);
        }
        catch (error) {
            console.error('Failed to save vehicle:', error);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Vehicles" }), _jsxs("button", { onClick: handleCreate, className: "btn btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "h-5 w-5" }), _jsx("span", { children: "Add Vehicle" })] })] }), _jsx(VehicleFilterBar, { searchTerm: searchTerm, onSearchTermChange: setSearchTerm, type: type, onTypeChange: setType, priceMin: priceMin, onPriceMinChange: setPriceMin, priceMax: priceMax, onPriceMaxChange: setPriceMax, onSearch: handleSearch, onClear: handleClear, isFiltered: isFiltered }), isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Loading vehicles..." }) })) : vehicles.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: vehicles.map((vehicle) => (_jsx(VehicleCard, { vehicle: vehicle, onEdit: handleEdit, onDelete: handleDelete }, vehicle.id))) }), pagination && (_jsx(Pagination, { currentPage: page, totalPages: pagination.totalPages, totalItems: pagination.total, itemsPerPage: limit, onPageChange: handlePageChange }))] })) : (_jsx("div", { className: "card text-center py-12", children: _jsx("p", { className: "text-gray-600", children: isFiltered
                        ? 'No vehicles found matching your search.'
                        : 'No vehicles yet. Add your first vehicle!' }) })), showForm && (_jsx(VehicleForm, { vehicle: editingVehicle, onSubmit: handleSubmit, onCancel: () => {
                    setShowForm(false);
                    setEditingVehicle(undefined);
                }, isLoading: createMutation.isPending || updateMutation.isPending }))] }));
};
//# sourceMappingURL=Vehicles.js.map