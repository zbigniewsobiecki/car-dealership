import React from 'react';
import { Search } from 'lucide-react';
import { RepairStatus } from '@car-dealership/shared-types';

interface RepairFilterBarProps {
  status: string;
  onStatusChange: (value: string) => void;
  technician: string;
  onTechnicianChange: (value: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onClear: () => void;
  isFiltered: boolean;
}

export const RepairFilterBar: React.FC<RepairFilterBarProps> = ({
  status,
  onStatusChange,
  technician,
  onTechnicianChange,
  onSearch,
  onClear,
  isFiltered,
}) => {
  return (
    <div className="card mb-6">
      <form onSubmit={onSearch} className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by technician name..."
            className="input pl-10"
            value={technician}
            onChange={(e) => onTechnicianChange(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          <select
            className="input w-48"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value={RepairStatus.PENDING}>Pending</option>
            <option value={RepairStatus.IN_PROGRESS}>In Progress</option>
            <option value={RepairStatus.COMPLETED}>Completed</option>
            <option value={RepairStatus.CANCELLED}>Cancelled</option>
          </select>
        </div>
        <div className="flex space-x-3">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={onClear}
              className="btn btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
