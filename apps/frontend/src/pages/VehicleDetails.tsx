import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVehicle } from '../hooks/useVehicles';
import { useRepairs, useCreateRepair, useUpdateRepair, useDeleteRepair } from '../hooks/useRepairs';
import { RepairCard } from '../components/repairs/RepairCard';
import { RepairForm } from '../components/repairs/RepairForm';
import { CreateRepairDto, Repair, VehicleType } from '@car-dealership/shared-types';
import { ArrowLeft, Plus, Car, Bike } from 'lucide-react';
import clsx from 'clsx';

const statusColors = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-gray-100 text-gray-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-red-100 text-red-800',
};

export const VehicleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | undefined>();

  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id || '');
  const { data: paginatedRepairs, isLoading: repairsLoading } = useRepairs({ vehicleId: id });
  const repairs = paginatedRepairs?.data || [];

  const createMutation = useCreateRepair();
  const updateMutation = useUpdateRepair();
  const deleteMutation = useDeleteRepair();

  const handleAddRepair = () => {
    setEditingRepair(undefined);
    setShowForm(true);
  };

  const handleEdit = (repair: Repair) => {
    setEditingRepair(repair);
    setShowForm(true);
  };

  const handleDelete = async (repair: Repair) => {
    if (window.confirm('Are you sure you want to delete this repair record?')) {
      await deleteMutation.mutateAsync(repair.id);
    }
  };

  const handleSubmit = async (data: CreateRepairDto) => {
    try {
      // Pre-fill vehicleId from the current vehicle
      const repairData = {
        ...data,
        vehicleId: id || '',
      };

      if (editingRepair) {
        await updateMutation.mutateAsync({ id: editingRepair.id, data: repairData });
      } else {
        await createMutation.mutateAsync(repairData);
      }
      setShowForm(false);
      setEditingRepair(undefined);
    } catch (error) {
      console.error('Failed to save repair:', error);
    }
  };

  if (vehicleLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Vehicle not found</p>
        <button onClick={() => navigate('/vehicles')} className="btn btn-primary mt-4">
          Back to Vehicles
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/vehicles')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Vehicles</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Details</h1>
      </div>

      {/* Vehicle Information Card */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-3 rounded-lg">
              {vehicle.type === VehicleType.MOTORCYCLE ? (
                <Bike className="h-6 w-6 text-primary-600" />
              ) : (
                <Car className="h-6 w-6 text-primary-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-sm text-gray-500">VIN: {vehicle.vin}</p>
            </div>
          </div>
          <span
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium capitalize',
              statusColors[vehicle.status]
            )}
          >
            {vehicle.status}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Price</p>
            <p className="text-lg font-semibold text-gray-900">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
          {vehicle.mileage && (
            <div>
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="text-lg font-semibold text-gray-900">
                {vehicle.mileage.toLocaleString()} mi
              </p>
            </div>
          )}
          {vehicle.type === VehicleType.MOTORCYCLE && vehicle.engineDisplacement && (
            <div>
              <p className="text-sm text-gray-500">Engine</p>
              <p className="text-lg font-semibold text-gray-900">
                {vehicle.engineDisplacement} cc
              </p>
            </div>
          )}
          {vehicle.condition && (
            <div>
              <p className="text-sm text-gray-500">Condition</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {vehicle.condition.replace('_', ' ')}
              </p>
            </div>
          )}
        </div>

        {(vehicle.transmission || vehicle.fuelType || (vehicle.type === VehicleType.MOTORCYCLE && vehicle.category)) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {vehicle.type === VehicleType.MOTORCYCLE && vehicle.category && (
              <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                {vehicle.category}
              </span>
            )}
            {vehicle.transmission && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {vehicle.transmission}
              </span>
            )}
            {vehicle.fuelType && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {vehicle.fuelType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Repair History Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Repair History</h2>
          <button onClick={handleAddRepair} className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Repair</span>
          </button>
        </div>

        {repairsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading repairs...</p>
          </div>
        ) : repairs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repairs.map((repair) => (
              <RepairCard
                key={repair.id}
                repair={repair}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-600">No repair history for this vehicle yet.</p>
          </div>
        )}
      </div>

      {showForm && (
        <RepairForm
          repair={editingRepair}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingRepair(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
          initialData={{ vehicleId: id }}
        />
      )}
    </div>
  );
};
