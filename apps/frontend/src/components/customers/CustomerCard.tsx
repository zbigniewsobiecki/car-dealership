import { Customer } from '@car-dealership/shared-types';
import { Edit, Trash2, User, Mail, Phone } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerCard = ({ customer, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-3 rounded-lg">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h3>
            {customer.city && customer.state && (
              <p className="text-sm text-gray-500">
                {customer.city}, {customer.state}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {customer.email && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{customer.phone}</span>
          </div>
        )}
      </div>

      {customer.address && (
        <div className="mb-4 text-sm text-gray-600">
          <p>{customer.address}</p>
          {customer.zipCode && <p>ZIP: {customer.zipCode}</p>}
        </div>
      )}

      {customer.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
          <p className="line-clamp-2">{customer.notes}</p>
        </div>
      )}

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(customer)}
          className="flex-1 btn btn-secondary flex items-center justify-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(customer)}
          className="flex-1 btn btn-danger flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
