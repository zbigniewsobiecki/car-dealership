import { useForm } from 'react-hook-form';
import {
  Repair,
  CreateRepairDto,
  RepairStatus,
  Customer,
} from '@car-dealership/shared-types';
import { ModalForm } from '../shared/ModalForm';
import { useVehicles } from '../../hooks/useVehicles';
import { useCustomers } from '../../hooks/useCustomers';

interface RepairFormProps {
  repair?: Repair;
  onSubmit: (data: CreateRepairDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const RepairForm = ({
  repair,
  onSubmit,
  onCancel,
  isLoading,
}: RepairFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRepairDto>({
    defaultValues: repair || {
      status: RepairStatus.PENDING,
    },
  });

  // Fetch vehicles and customers for dropdowns
  const { data: vehiclesData } = useVehicles({ limit: 1000 });
  const { data: customersData } = useCustomers();

  const vehicles = vehiclesData?.data || [];
  const customers = customersData || [];

  return (
    <ModalForm
      title={repair ? 'Edit Repair' : 'Add New Repair'}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      submitLabel={repair ? 'Update Repair' : 'Add Repair'}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Vehicle *</label>
          <select
            {...register('vehicleId', { required: 'Vehicle is required' })}
            className="input"
            disabled={!!repair}
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.vin}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-red-600 text-sm mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="label">Customer *</label>
          <select
            {...register('customerId', { required: 'Customer is required' })}
            className="input"
            disabled={!!repair}
          >
            <option value="">Select a customer</option>
            {customers.map((customer: Customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-600 text-sm mt-1">{errors.customerId.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="label">Description *</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="input"
            rows={3}
            placeholder="Describe the repair work needed..."
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="label">Status</label>
          <select {...register('status')} className="input">
            <option value={RepairStatus.PENDING}>Pending</option>
            <option value={RepairStatus.IN_PROGRESS}>In Progress</option>
            <option value={RepairStatus.COMPLETED}>Completed</option>
            <option value={RepairStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div>
          <label className="label">Estimated Cost</label>
          <input
            type="number"
            step="0.01"
            {...register('estimatedCost', {
              valueAsNumber: true,
              min: { value: 0, message: 'Cost must be positive' },
            })}
            className="input"
            placeholder="0.00"
          />
          {errors.estimatedCost && (
            <p className="text-red-600 text-sm mt-1">{errors.estimatedCost.message}</p>
          )}
        </div>

        <div>
          <label className="label">Actual Cost</label>
          <input
            type="number"
            step="0.01"
            {...register('actualCost', {
              valueAsNumber: true,
              min: { value: 0, message: 'Cost must be positive' },
            })}
            className="input"
            placeholder="0.00"
          />
          {errors.actualCost && (
            <p className="text-red-600 text-sm mt-1">{errors.actualCost.message}</p>
          )}
        </div>

        <div>
          <label className="label">Estimated Completion Date</label>
          <input
            type="date"
            {...register('estimatedCompletionDate')}
            className="input"
          />
        </div>

        <div>
          <label className="label">Actual Completion Date</label>
          <input
            type="date"
            {...register('actualCompletionDate')}
            className="input"
          />
        </div>

        <div className="col-span-2">
          <label className="label">Notes</label>
          <textarea
            {...register('notes')}
            className="input"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>
      </div>
    </ModalForm>
  );
};
