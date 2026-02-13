import { Vehicle, VehicleType } from '@car-dealership/shared-types';
import { Edit, Trash2, Car, Bike } from 'lucide-react';
import clsx from 'clsx';

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

const statusColors = {
  available: 'bg-green-100 text-green-800',
  sold: 'bg-gray-100 text-gray-800',
  reserved: 'bg-yellow-100 text-yellow-800',
  maintenance: 'bg-red-100 text-red-800',
};

export const VehicleCard = ({ vehicle, onEdit, onDelete }: VehicleCardProps) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
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
            <h3 className="text-lg font-semibold text-gray-900">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
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

      <div className="grid grid-cols-2 gap-4 mb-4">
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
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {vehicle.condition && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize">
            {vehicle.condition.replace('_', ' ')}
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

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(vehicle)}
          className="flex-1 btn btn-secondary flex items-center justify-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(vehicle)}
          className="flex-1 btn btn-danger flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
