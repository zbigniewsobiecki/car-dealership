import { useState } from 'react';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from '../hooks/useVehicles';
import { useVehicleFilters } from '../hooks/useVehicleFilters';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Pagination } from '../components/shared/Pagination';
import { VehicleFilterBar } from '../components/vehicles/VehicleFilterBar';
import { Vehicle, CreateVehicleDto } from '@car-dealership/shared-types';
import { Plus } from 'lucide-react';

export const Vehicles = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  
  const {
    searchTerm,
    setSearchTerm,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    type,
    setType,
    page,
    filters,
    handleSearch,
    handlePageChange,
    handleClear,
    isFiltered,
    limit,
  } = useVehicleFilters();

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

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleDelete = async (vehicle: Vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.year} ${vehicle.make} ${vehicle.model}?`)) {
      await deleteMutation.mutateAsync(vehicle.id);
    }
  };

  const handleSubmit = async (data: CreateVehicleDto) => {
    try {
      if (editingVehicle) {
        await updateMutation.mutateAsync({ id: editingVehicle.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditingVehicle(undefined);
    } catch (error) {
      console.error('Failed to save vehicle:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
        <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <VehicleFilterBar
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        priceMin={priceMin}
        onPriceMinChange={setPriceMin}
        priceMax={priceMax}
        onPriceMaxChange={setPriceMax}
        type={type}
        onTypeChange={setType}
        onSearch={handleSearch}
        onClear={handleClear}
        isFiltered={isFiltered}
      />

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      ) : vehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={limit}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">
            {isFiltered
              ? 'No vehicles found matching your search.'
              : 'No vehicles yet. Add your first vehicle!'}
          </p>
        </div>
      )}

      {showForm && (
        <VehicleForm
          vehicle={editingVehicle}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingVehicle(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};