import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useSales, useCreateSale, useUpdateSale, useDeleteSale } from '../hooks/useSales';
import { SaleCard } from '../components/sales/SaleCard';
import { SaleForm } from '../components/sales/SaleForm';
import { Plus } from 'lucide-react';
export const Sales = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingSale, setEditingSale] = useState();
    const { data: sales, isLoading } = useSales();
    const createMutation = useCreateSale();
    const updateMutation = useUpdateSale();
    const deleteMutation = useDeleteSale();
    const handleCreate = () => {
        setEditingSale(undefined);
        setShowForm(true);
    };
    const handleEdit = (sale) => {
        setEditingSale(sale);
        setShowForm(true);
    };
    const handleDelete = async (sale) => {
        if (window.confirm('Are you sure you want to delete this sale?')) {
            await deleteMutation.mutateAsync(sale.id);
        }
    };
    const handleSubmit = async (data) => {
        try {
            if (editingSale) {
                await updateMutation.mutateAsync({ id: editingSale.id, data });
            }
            else {
                await createMutation.mutateAsync(data);
            }
            setShowForm(false);
            setEditingSale(undefined);
        }
        catch (error) {
            console.error('Failed to save sale:', error);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Sales" }), _jsxs("button", { onClick: handleCreate, className: "btn btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "h-5 w-5" }), _jsx("span", { children: "New Sale" })] })] }), isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Loading sales..." }) })) : sales && sales.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: sales.map((sale) => (_jsx(SaleCard, { sale: sale, onEdit: handleEdit, onDelete: handleDelete }, sale.id))) })) : (_jsx("div", { className: "card text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "No sales yet. Create your first sale!" }) })), showForm && (_jsx(SaleForm, { sale: editingSale, onSubmit: handleSubmit, onCancel: () => {
                    setShowForm(false);
                    setEditingSale(undefined);
                }, isLoading: createMutation.isPending || updateMutation.isPending }))] }));
};
//# sourceMappingURL=Sales.js.map