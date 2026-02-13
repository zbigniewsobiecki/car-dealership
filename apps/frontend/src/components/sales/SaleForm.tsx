import { useForm } from 'react-hook-form';
import { Sale, CreateSaleDto, SaleStatus, VehicleStatus } from '@car-dealership/shared-types';
import { useVehicles } from '../../hooks/useVehicles';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuthStore } from '../../store/authStore';
import { ModalForm } from '../shared/ModalForm';

interface SaleFormProps {
  sale?: Sale;
  onSubmit: (data: CreateSaleDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const SaleForm = ({ sale, onSubmit, onCancel, isLoading }: SaleFormProps) => {
  const user = useAuthStore((state) => state.user);
  const { data: paginatedVehicles } = useVehicles({ limit: 1000 });
  const vehicles = paginatedVehicles?.data || [];
  const { data: customers } = useCustomers();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CreateSaleDto, 'saleDate'> & { saleDate: string }>({
    defaultValues: sale ? {
      ...sale,
      saleDate: new Date(sale.saleDate).toISOString().split('T')[0]
    } as unknown as Omit<CreateSaleDto, 'saleDate'> & { saleDate: string } : {
      salespersonId: user?.id,
      saleDate: new Date().toISOString().split('T')[0],
      status: SaleStatus.PENDING,
    },
  });

  const handleFormSubmit = (data: Omit<CreateSaleDto, 'saleDate'> & { saleDate: string }) => {
    onSubmit({
      ...data,
      saleDate: new Date(data.saleDate),
    } as CreateSaleDto);
  };

  // Filter available vehicles for new sales
  const availableVehicles = vehicles.filter(
    (v) =>
      v.status === VehicleStatus.AVAILABLE ||
      (sale && v.id === sale.vehicleId)
  );

  return (
    <ModalForm
      title={sale ? 'Edit Sale' : 'New Sale'}
      onCancel={onCancel}
      onSubmit={handleSubmit(handleFormSubmit)}
      submitLabel={sale ? 'Update Sale' : 'Create Sale'}
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
            {availableVehicles?.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.year} {vehicle.make} {vehicle.model} - ${vehicle.price}
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

        <div>
          <label htmlFor="salePrice" className="label">Sale Price *</label>
          <input
            id="salePrice"
            type="number"
            step="0.01"
            {...register('salePrice', {
              required: 'Sale price is required',
              valueAsNumber: true,
            })}
            className="input"
            placeholder="28000.00"
          />
          {errors.salePrice && (
            <p className="text-red-600 text-sm mt-1">{errors.salePrice.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="saleDate" className="label">Sale Date *</label>
          <input
            id="saleDate"
            type="date"
            {...register('saleDate', { required: 'Sale date is required' })}
            className="input"
          />
          {errors.saleDate && (
            <p className="text-red-600 text-sm mt-1">{errors.saleDate.message as string}</p>
          )}
        </div>

        <div>
          <label htmlFor="paymentMethod" className="label">Payment Method</label>
          <select id="paymentMethod" {...register('paymentMethod')} className="input">
            <option value="">Select payment method</option>
            <option value="Cash">Cash</option>
            <option value="Financing">Financing</option>
            <option value="Lease">Lease</option>
            <option value="Check">Check</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="label">Status *</label>
          <select id="status" {...register('status')} className="input">
            <option value={SaleStatus.PENDING}>Pending</option>
            <option value={SaleStatus.COMPLETED}>Completed</option>
            <option value={SaleStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="downPayment" className="label">Down Payment</label>
          <input
            id="downPayment"
            type="number"
            step="0.01"
            {...register('downPayment', { valueAsNumber: true })}
            className="input"
            placeholder="5000.00"
          />
        </div>

        <div>
          <label htmlFor="tradeInValue" className="label">Trade-In Value</label>
          <input
            id="tradeInValue"
            type="number"
            step="0.01"
            {...register('tradeInValue', { valueAsNumber: true })}
            className="input"
            placeholder="3000.00"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tradeInVehicle" className="label">Trade-In Vehicle</label>
        <input
          id="tradeInVehicle"
          {...register('tradeInVehicle')}
          className="input"
          placeholder="2015 Honda Civic"
        />
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea
          id="notes"
          {...register('notes')}
          className="input"
          rows={3}
          placeholder="Additional notes about the sale..."
        />
      </div>

      <input type="hidden" {...register('salespersonId')} />
    </ModalForm>
  );
};