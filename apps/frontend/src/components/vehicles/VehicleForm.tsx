import { useForm } from 'react-hook-form';
import {
  Vehicle,
  CreateVehicleDto,
  VehicleStatus,
  VehicleCondition,
} from '@car-dealership/shared-types';
import { X } from 'lucide-react';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (data: CreateVehicleDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const VehicleForm = ({
  vehicle,
  onSubmit,
  onCancel,
  isLoading,
}: VehicleFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVehicleDto>({
    defaultValues: vehicle || {
      status: VehicleStatus.AVAILABLE,
      condition: VehicleCondition.USED,
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">VIN *</label>
              <input
                {...register('vin', { required: 'VIN is required' })}
                className="input"
                placeholder="1HGCM82633A123456"
              />
              {errors.vin && (
                <p className="text-red-600 text-sm mt-1">{errors.vin.message}</p>
              )}
            </div>

            <div>
              <label className="label">Make *</label>
              <input
                {...register('make', { required: 'Make is required' })}
                className="input"
                placeholder="Honda"
              />
              {errors.make && (
                <p className="text-red-600 text-sm mt-1">{errors.make.message}</p>
              )}
            </div>

            <div>
              <label className="label">Model *</label>
              <input
                {...register('model', { required: 'Model is required' })}
                className="input"
                placeholder="Accord"
              />
              {errors.model && (
                <p className="text-red-600 text-sm mt-1">{errors.model.message}</p>
              )}
            </div>

            <div>
              <label className="label">Year *</label>
              <input
                type="number"
                {...register('year', {
                  required: 'Year is required',
                  min: { value: 1900, message: 'Invalid year' },
                  max: { value: 2100, message: 'Invalid year' },
                })}
                className="input"
                placeholder="2023"
              />
              {errors.year && (
                <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
              )}
            </div>

            <div>
              <label className="label">Color *</label>
              <input
                {...register('color', { required: 'Color is required' })}
                className="input"
                placeholder="Silver"
              />
              {errors.color && (
                <p className="text-red-600 text-sm mt-1">{errors.color.message}</p>
              )}
            </div>

            <div>
              <label className="label">Mileage</label>
              <input
                type="number"
                {...register('mileage', { valueAsNumber: true })}
                className="input"
                placeholder="15000"
              />
            </div>

            <div>
              <label className="label">Price *</label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Price is required',
                  valueAsNumber: true,
                })}
                className="input"
                placeholder="28500.00"
              />
              {errors.price && (
                <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="label">Cost</label>
              <input
                type="number"
                step="0.01"
                {...register('cost', { valueAsNumber: true })}
                className="input"
                placeholder="25000.00"
              />
            </div>

            <div>
              <label className="label">Status *</label>
              <select {...register('status')} className="input">
                <option value={VehicleStatus.AVAILABLE}>Available</option>
                <option value={VehicleStatus.SOLD}>Sold</option>
                <option value={VehicleStatus.RESERVED}>Reserved</option>
                <option value={VehicleStatus.MAINTENANCE}>Maintenance</option>
              </select>
            </div>

            <div>
              <label className="label">Condition</label>
              <select {...register('condition')} className="input">
                <option value="">Select condition</option>
                <option value={VehicleCondition.NEW}>New</option>
                <option value={VehicleCondition.USED}>Used</option>
                <option value={VehicleCondition.CERTIFIED_PRE_OWNED}>
                  Certified Pre-Owned
                </option>
              </select>
            </div>

            <div>
              <label className="label">Transmission</label>
              <input
                {...register('transmission')}
                className="input"
                placeholder="Automatic"
              />
            </div>

            <div>
              <label className="label">Fuel Type</label>
              <input
                {...register('fuelType')}
                className="input"
                placeholder="Gasoline"
              />
            </div>

            <div>
              <label className="label">Body Type</label>
              <input
                {...register('bodyType')}
                className="input"
                placeholder="Sedan"
              />
            </div>

            <div>
              <label className="label">Engine</label>
              <input
                {...register('engine')}
                className="input"
                placeholder="2.0L I4"
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              {...register('description')}
              className="input"
              rows={3}
              placeholder="Additional details about the vehicle..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
