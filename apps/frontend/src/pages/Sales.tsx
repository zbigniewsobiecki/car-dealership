import { useState } from 'react';
import { useSales, useCreateSale, useUpdateSale, useDeleteSale } from '../hooks/useSales';
import { SaleCard } from '../components/sales/SaleCard';
import { SaleForm } from '../components/sales/SaleForm';
import { Sale, CreateSaleDto } from '@car-dealership/shared-types';
import { Plus } from 'lucide-react';

export const Sales = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>();

  const { data: sales, isLoading } = useSales();
  const createMutation = useCreateSale();
  const updateMutation = useUpdateSale();
  const deleteMutation = useDeleteSale();

  const handleCreate = () => {
    setEditingSale(undefined);
    setShowForm(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleDelete = async (sale: Sale) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      await deleteMutation.mutateAsync(sale.id);
    }
  };

  const handleSubmit = async (data: CreateSaleDto) => {
    try {
      if (editingSale) {
        await updateMutation.mutateAsync({ id: editingSale.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
      setEditingSale(undefined);
    } catch (error) {
      console.error('Failed to save sale:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
        <button onClick={handleCreate} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>New Sale</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading sales...</p>
        </div>
      ) : sales && sales.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <SaleCard key={sale.id} sale={sale} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <p className="text-gray-600">No sales yet. Create your first sale!</p>
        </div>
      )}

      {showForm && (
        <SaleForm
          sale={editingSale}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingSale(undefined);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};
