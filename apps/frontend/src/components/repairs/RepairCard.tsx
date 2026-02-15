import { Repair } from '@car-dealership/shared-types';
import { Edit, Trash2, Wrench, Calendar, DollarSign } from 'lucide-react';
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

const statusLabels = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const RepairCard = ({ repair, onEdit, onDelete }: RepairCardProps) => {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Wrench className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Repair #{repair.id.slice(0, 8)}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-1">
              {repair.description}
            </p>
          </div>
        </div>
        <span
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium',
            statusColors[repair.status]
          )}
        >
          {statusLabels[repair.status]}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-500">
            <DollarSign className="h-4 w-4" />
            <span>Estimated Cost</span>
          </div>
          <span className="font-semibold text-gray-900">
            {repair.estimatedCost ? `$${repair.estimatedCost.toLocaleString()}` : 'N/A'}
          </span>
        </div>

        {repair.actualCost && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <DollarSign className="h-4 w-4" />
              <span>Actual Cost</span>
            </div>
            <span className="font-semibold text-gray-900">
              ${repair.actualCost.toLocaleString()}
            </span>
          </div>
        )}

        {repair.estimatedCompletionDate && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Est. Completion</span>
            </div>
            <span className="font-semibold text-gray-900">
              {new Date(repair.estimatedCompletionDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {repair.actualCompletionDate && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Completed</span>
            </div>
            <span className="font-semibold text-gray-900">
              {new Date(repair.actualCompletionDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {repair.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 line-clamp-2">{repair.notes}</p>
        </div>
      )}

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
