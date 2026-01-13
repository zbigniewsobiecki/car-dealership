import { useState } from 'react';
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from '../hooks/useCustomers';
import { CustomerCard } from '../components/customers/CustomerCard';
import { CustomerForm } from '../components/customers/CustomerForm';
import { Customer, CreateCustomerDto } from '@car-dealership/shared-types';
import { Plus } from 'lucide-react';

export const Customers = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

  const { data: customers, isLoading } = useCustomers();
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleCreate = () => {
    setEditingCustomer(undefined);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (customer: Customer) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`
      )
    ) {
      await deleteMutation.mutateAsync(customer.id);
    }
  };

  const handleSubmit = async (data: CreateCustomerDto) => {
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({ id: editingCustomer.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditingCustomer(undefined);
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading customers...</p>
        </div>
      ) : customers && customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">No customers yet. Add your first customer!</p>
        </div>
      )}

      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCustomer(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};
