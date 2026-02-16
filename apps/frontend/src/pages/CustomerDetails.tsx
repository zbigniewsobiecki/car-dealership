import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCustomer } from '../hooks/useCustomers';
import { useRepairs, useCreateRepair, useUpdateRepair, useDeleteRepair } from '../hooks/useRepairs';
import { RepairCard } from '../components/repairs/RepairCard';
import { RepairForm } from '../components/repairs/RepairForm';
import { CreateRepairDto, Repair } from '@car-dealership/shared-types';
import { ArrowLeft, Plus, User, Mail, Phone } from 'lucide-react';

export const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | undefined>();

  const { data: customer, isLoading: customerLoading } = useCustomer(id || '');
  const { data: paginatedRepairs, isLoading: repairsLoading } = useRepairs({ customerId: id });
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
      // Pre-fill customerId from the current customer
      const repairData = {
        ...data,
        customerId: id || '',
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

  if (customerLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Customer not found</p>
        <button onClick={() => navigate('/customers')} className="btn btn-primary mt-4">
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header with back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Customers</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
      </div>

      {/* Customer Information Card */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-primary-100 p-3 rounded-lg">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h2>
            {customer.city && customer.state && (
              <p className="text-sm text-gray-500">
                {customer.city}, {customer.state}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {customer.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-5 w-5" />
              <span>{customer.email}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="h-5 w-5" />
              <span>{customer.phone}</span>
            </div>
          )}
        </div>

        {customer.address && (
          <div className="mb-4 text-gray-600">
            <p className="font-medium text-sm text-gray-500 mb-1">Address</p>
            <p>{customer.address}</p>
            {customer.zipCode && <p>ZIP: {customer.zipCode}</p>}
          </div>
        )}

        {customer.notes && (
          <div className="p-3 bg-gray-50 rounded text-gray-700">
            <p className="font-medium text-sm text-gray-500 mb-1">Notes</p>
            <p>{customer.notes}</p>
          </div>
        )}
      </div>

      {/* Service History Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Service History</h2>
          <button onClick={handleAddRepair} className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Repair</span>
          </button>
        </div>

        {repairsLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading service history...</p>
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
            <p className="text-gray-600">No service history for this customer yet.</p>
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
          initialData={{ customerId: id }}
        />
      )}
    </div>
  );
};
