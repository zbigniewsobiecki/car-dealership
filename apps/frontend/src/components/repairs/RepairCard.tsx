import { Repair } from '@car-dealership/shared-types';
import { Edit, Trash2, Wrench } from 'lucide-react';
import clsx from 'clsx';

interface RepairCardProps {
  repair: Repair;
  onEdit: (repair: Repair) => void;
  onDelete: (repair: Repair) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

export const RepairCard = ({ repair, onEdit, onDelete }: RepairCardProps) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Wrench className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {repair.description}
            </h3>
            {repair.technician && (
              <p className="text-sm text-gray-500">
                Technician: {repair.technician}
              </p>
            )}
          </div>
        </div>
        <span
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium capitalize',
            statusColors[repair.status]
          )}
        >
          {repair.status.replace('_', ' ')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Start Date</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatDate(repair.startDate)}
          </p>
        </div>
        {repair.endDate && (
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDate(repair.endDate)}
            </p>
          </div>
        )}
        {repair.cost !== undefined && (
          <div>
            <p className="text-sm text-gray-500">Cost</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(repair.cost)}
            </p>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onEdit(repair)}
          className="flex-1 btn btn-secondary flex items-center justify-center space-x-2"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(repair)}
          className="flex-1 btn btn-danger flex items-center justify-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
