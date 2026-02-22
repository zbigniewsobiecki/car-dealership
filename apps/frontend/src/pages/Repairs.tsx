import { useState } from 'react';
import {
  useRepairs,
  useCreateRepair,
  useUpdateRepair,
  useDeleteRepair,
} from '../hooks/useRepairs';
import { useRepairFilters } from '../hooks/useRepairFilters';
import { RepairCard } from '../components/repairs/RepairCard';
import { RepairForm } from '../components/repairs/RepairForm';
import { Pagination } from '../components/shared/Pagination';
import { RepairFilterBar } from '../components/repairs/RepairFilterBar';
import { Repair, CreateRepairDto } from '@car-dealership/shared-types';
import { Plus } from 'lucide-react';

export const Repairs = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | undefined>();

  const {
    status,
    setStatus,
    technician,
    setTechnician,
    page,
    filters,
    handleSearch,
    handlePageChange,
    handleClear,
    isFiltered,
    limit,
  } = useRepairFilters();

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
    if (window.confirm(`Are you sure you want to delete this repair: ${repair.description}?`)) {
      try {
        await deleteMutation.mutateAsync(repair.id);
      } catch (error) {
        console.error('Failed to delete repair:', error);
      }
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Repairs</h1>
        <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Repair</span>
        </button>
      </div>

      <RepairFilterBar
        status={status}
        onStatusChange={setStatus}
        technician={technician}
        onTechnicianChange={setTechnician}
        onSearch={handleSearch}
        onClear={handleClear}
        isFiltered={isFiltered}
      />

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
              onPageChange={handlePageChange}
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
