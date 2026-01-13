import { Sale } from '@car-dealership/shared-types';
import { Edit, Trash2, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';

interface SaleCardProps {
  sale: Sale;
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const SaleCard = ({ sale, onEdit, onDelete }: SaleCardProps) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-3 rounded-lg">
            <ShoppingCart className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sale #{sale.id.slice(0, 8)}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(sale.saleDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium capitalize',
            statusColors[sale.status]
          )}
        >
          {sale.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-sm text-gray-500">Sale Price</p>
          <p className="text-2xl font-bold text-gray-900">
            ${sale.salePrice.toLocaleString()}
          </p>
        </div>

        {sale.paymentMethod && (
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>
            <p className="text-sm font-medium text-gray-900">{sale.paymentMethod}</p>
          </div>
        )}

        {sale.downPayment && (
          <div>
            <p className="text-sm text-gray-500">Down Payment</p>
            <p className="text-sm font-medium text-gray-900">
              ${sale.downPayment.toLocaleString()}
            </p>
          </div>
        )}

        {sale.tradeInValue && (
          <div>
            <p className="text-sm text-gray-500">Trade-In Value</p>
            <p className="text-sm font-medium text-gray-900">
              ${sale.tradeInValue.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {sale.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
          <p className="line-clamp-2">{sale.notes}</p>
        </div>
      )}

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(sale)}
          className="flex-1 btn btn-secondary flex items-center justify-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(sale)}
          className="flex-1 btn btn-danger flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
