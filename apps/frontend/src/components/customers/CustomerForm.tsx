import { useForm } from 'react-hook-form';
import { Customer, CreateCustomerDto } from '@car-dealership/shared-types';
import { X } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomerDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CustomerForm = ({
  customer,
  onSubmit,
  onCancel,
  isLoading,
}: CustomerFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerDto>({
    defaultValues: customer,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {customer ? 'Edit Customer' : 'Add New Customer'}
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
              <label className="label">First Name *</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className="input"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name *</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className="input"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                {...register('email')}
                className="input"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                {...register('phone')}
                className="input"
                placeholder="555-0123"
              />
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <input
              {...register('address')}
              className="input"
              placeholder="123 Main St"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">City</label>
              <input
                {...register('city')}
                className="input"
                placeholder="Springfield"
              />
            </div>

            <div>
              <label className="label">State</label>
              <input
                {...register('state')}
                className="input"
                placeholder="IL"
              />
            </div>

            <div>
              <label className="label">ZIP Code</label>
              <input
                {...register('zipCode')}
                className="input"
                placeholder="62701"
              />
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              {...register('notes')}
              className="input"
              rows={3}
              placeholder="Additional notes about the customer..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : customer ? 'Update Customer' : 'Add Customer'}
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
