import { useState } from 'react';
import {
  useVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
} from '../hooks/useVehicles';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Vehicle, CreateVehicleDto, VehicleFilters } from '@car-dealership/shared-types';
import { Plus, Search } from 'lucide-react';

export const Vehicles = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [filters, setFilters] = useState<VehicleFilters>({});

  const { data: vehicles, isLoading } = useVehicles(filters);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: VehicleFilters = { ...filters, search: searchTerm };
    
    if (priceMin) {
      newFilters.priceMin = Number(priceMin);
    } else {
      delete newFilters.priceMin;
    }
    
    if (priceMax) {
      newFilters.priceMax = Number(priceMax);
    } else {
      delete newFilters.priceMax;
    }
    
    setFilters(newFilters);
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

      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by make, model, or VIN..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <input
              type="number"
              placeholder="Min Price"
              className="input w-32"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="input w-32"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
            {(filters.search || filters.priceMin !== undefined || filters.priceMax !== undefined) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setPriceMin('');
                  setPriceMax('');
                  setFilters({});
                }}
                className="btn btn-secondary"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading vehicles...</p>
        </div>
      ) : vehicles && vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">
            {filters.search ? 'No vehicles found matching your search.' : 'No vehicles yet. Add your first vehicle!'}
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
