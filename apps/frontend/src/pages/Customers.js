import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useCustomers, useCreateCustomer, useUpdateCustomer, useDeleteCustomer, } from '../hooks/useCustomers';
import { CustomerCard } from '../components/customers/CustomerCard';
import { CustomerForm } from '../components/customers/CustomerForm';
import { Plus } from 'lucide-react';
export const Customers = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState();
    const { data: customers, isLoading } = useCustomers();
    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer();
    const deleteMutation = useDeleteCustomer();
    const handleCreate = () => {
        setEditingCustomer(undefined);
        setShowForm(true);
    };
    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setShowForm(true);
    };
    const handleDelete = async (customer) => {
        if (window.confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
            await deleteMutation.mutateAsync(customer.id);
        }
    };
    const handleSubmit = async (data) => {
        try {
            if (editingCustomer) {
                await updateMutation.mutateAsync({ id: editingCustomer.id, data });
            }
            else {
                await createMutation.mutateAsync(data);
            }
            setShowForm(false);
            setEditingCustomer(undefined);
        }
        catch (error) {
            console.error('Failed to save customer:', error);
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "Customers" }), _jsxs("button", { onClick: handleCreate, className: "btn btn-primary flex items-center space-x-2", children: [_jsx(Plus, { className: "h-5 w-5" }), _jsx("span", { children: "Add Customer" })] })] }), isLoading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "Loading customers..." }) })) : customers && customers.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: customers.map((customer) => (_jsx(CustomerCard, { customer: customer, onEdit: handleEdit, onDelete: handleDelete }, customer.id))) })) : (_jsx("div", { className: "card text-center py-12", children: _jsx("p", { className: "text-gray-600", children: "No customers yet. Add your first customer!" }) })), showForm && (_jsx(CustomerForm, { customer: editingCustomer, onSubmit: handleSubmit, onCancel: () => {
                    setShowForm(false);
                    setEditingCustomer(undefined);
                }, isLoading: createMutation.isPending || updateMutation.isPending }))] }));
};
//# sourceMappingURL=Customers.js.map