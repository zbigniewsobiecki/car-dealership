import { useForm } from 'react-hook-form';
import { Repair, CreateRepairDto, RepairStatus } from '@car-dealership/shared-types';
import { useVehicles } from '../../hooks/useVehicles';
import { useCustomers } from '../../hooks/useCustomers';
import { ModalForm } from '../shared/ModalForm';

interface RepairFormProps {
  repair?: Repair;
  onSubmit: (data: CreateRepairDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateRepairDto>;
}

export const RepairForm = ({ repair, onSubmit, onCancel, isLoading, initialData }: RepairFormProps) => {
  const { data: paginatedVehicles } = useVehicles({ limit: 1000 });
  const vehicles = paginatedVehicles?.data || [];
  const { data: customers } = useCustomers();

  type FormValues = Omit<CreateRepairDto, 'startDate' | 'endDate'> & { startDate: string; endDate?: string };

  const getDefaultValues = (): FormValues => {
    if (repair) {
      return {
        ...repair,
        startDate: new Date(repair.startDate).toISOString().split('T')[0],
        endDate: repair.endDate ? new Date(repair.endDate).toISOString().split('T')[0] : undefined,
      } as FormValues;
    }

    return {
      vehicleId: initialData?.vehicleId || '',
      customerId: initialData?.customerId || '',
      description: '',
      status: RepairStatus.PENDING,
      startDate: new Date().toISOString().split('T')[0],
    } as FormValues;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(),
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    } as CreateRepairDto);
  };

  return (
    <ModalForm
      title={repair ? 'Edit Repair' : 'New Repair'}
      onCancel={onCancel}
      onSubmit={handleSubmit(handleFormSubmit)}
      submitLabel={repair ? 'Update Repair' : 'Create Repair'}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehicleId" className="label">Vehicle *</label>
          <select
            id="vehicleId"
            {...register('vehicleId', { required: 'Vehicle is required' })}
            className="input"
          >
            <option value="">Select vehicle</option>
            {vehicles?.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-red-600 text-sm mt-1">{errors.vehicleId.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="customerId" className="label">Customer *</label>
          <select
            id="customerId"
            {...register('customerId', { required: 'Customer is required' })}
            className="input"
          >
            <option value="">Select customer</option>
            {customers?.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-600 text-sm mt-1">{errors.customerId.message as string}</p>
          )}
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="label">Description *</label>
          <textarea
            id="description"
            {...register('description', { required: 'Description is required' })}
            className="input"
            rows={2}
            placeholder="Describe the repair work needed..."
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">{errors.description.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="label">Status *</label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className="input"
          >
            <option value={RepairStatus.PENDING}>Pending</option>
            <option value={RepairStatus.IN_PROGRESS}>In Progress</option>
            <option value={RepairStatus.COMPLETED}>Completed</option>
            <option value={RepairStatus.CANCELLED}>Cancelled</option>
          </select>
          {errors.status && (
            <p className="text-red-600 text-sm mt-1">{errors.status.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="cost" className="label">Cost</label>
          <input
            id="cost"
            type="number"
            step="0.01"
            {...register('cost', { valueAsNumber: true })}
            className="input"
            placeholder="1500.00"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="label">Start Date *</label>
          <input
            id="startDate"
            type="date"
            {...register('startDate', { required: 'Start date is required' })}
            className="input"
          />
          {errors.startDate && (
            <p className="text-red-600 text-sm mt-1">{errors.startDate.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDate" className="label">End Date</label>
          <input
            id="endDate"
            type="date"
            {...register('endDate')}
            className="input"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="technician" className="label">Technician</label>
          <input
            id="technician"
            {...register('technician')}
            className="input"
            placeholder="John Smith"
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea
          id="notes"
          {...register('notes')}
          className="input"
          rows={3}
          placeholder="Additional notes about the repair..."
        />
      </div>
    </ModalForm>
  );
};
