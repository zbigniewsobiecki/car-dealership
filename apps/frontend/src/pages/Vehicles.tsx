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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState<VehicleFilters>({ page: 1, limit: 10 });

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: VehicleFilters = { ...filters, search: searchTerm, page: 1 };

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

    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters({ ...filters, page: newPage });
    window.scrollTo(0, 0);
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
              min="0"
            />
            <input
              type="number"
              placeholder="Max Price"
              className="input w-32"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              min="0"
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

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(page * limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-medium">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === i + 1
                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">
            {filters.search || filters.priceMin !== undefined || filters.priceMax !== undefined
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
