import { useState } from 'react';
import {
  useRepairs,
  useCreateRepair,
  useUpdateRepair,
  useDeleteRepair,
} from '../hooks/useRepairs';
import { RepairCard } from '../components/repairs/RepairCard';
import { RepairForm } from '../components/repairs/RepairForm';
import { Pagination } from '../components/shared/Pagination';
import { Repair, CreateRepairDto, RepairStatus } from '@car-dealership/shared-types';
import { Plus, Search } from 'lucide-react';

export const Repairs = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | undefined>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RepairStatus | ''>('');
  const limit = 12;

  const filters = {
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  };

  const { data: paginatedData, isLoading } = useRepairs(filters);
  const repairs = paginatedData?.data || [];
  const pagination = paginatedData?.pagination;
  const createMutation = useCreateRepair();
  const updateMutation = useUpdateRepair();
  const deleteMutation = useDeleteRepair();

  const handleCreate = () => {
    setEditingRepair(undefined);
    setShowForm(true);
  };

  const handleEdit = (repair: Repair) => {
    setEditingRepair(repair);
    setShowForm(true);
  };

  const handleDelete = async (repair: Repair) => {
    if (window.confirm('Are you sure you want to delete this repair?')) {
      await deleteMutation.mutateAsync(repair.id);
    }
  };

  const handleSubmit = async (data: CreateRepairDto) => {
    try {
      if (editingRepair) {
        await updateMutation.mutateAsync({ id: editingRepair.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditingRepair(undefined);
    } catch (error) {
      console.error('Failed to save repair:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(1);
  };

  const isFiltered = searchTerm !== '' || statusFilter !== '';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Repairs</h1>
        <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Repair</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search repairs..."
                className="input pl-10"
              />
            </div>
          </div>

          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RepairStatus | '')}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value={RepairStatus.PENDING}>Pending</option>
              <option value={RepairStatus.IN_PROGRESS}>In Progress</option>
              <option value={RepairStatus.COMPLETED}>Completed</option>
              <option value={RepairStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Search
          </button>

          {isFiltered && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-secondary"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading repairs...</p>
        </div>
      ) : repairs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {repairs.map((repair) => (
              <RepairCard
                key={repair.id}
                repair={repair}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">
            {isFiltered
              ? 'No repairs found matching your search.'
              : 'No repairs yet. Add your first repair!'}
          </p>
        </div>
      )}

      {showForm && (
        <RepairForm
          repair={editingRepair}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingRepair(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};
