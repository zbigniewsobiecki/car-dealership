import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { SaleStatus, VehicleStatus } from '@car-dealership/shared-types';
import { useVehicles } from '../../hooks/useVehicles';
import { useCustomers } from '../../hooks/useCustomers';
import { useAuthStore } from '../../store/authStore';
import { ModalForm } from '../shared/ModalForm';
export const SaleForm = ({ sale, onSubmit, onCancel, isLoading }) => {
    const user = useAuthStore((state) => state.user);
    const { data: paginatedVehicles } = useVehicles({ limit: 1000 });
    const vehicles = paginatedVehicles?.data || [];
    const { data: customers } = useCustomers();
    const { register, handleSubmit, formState: { errors }, } = useForm({
        defaultValues: sale ? {
            ...sale,
            saleDate: new Date(sale.saleDate).toISOString().split('T')[0]
        } : {
            salespersonId: user?.id,
            saleDate: new Date().toISOString().split('T')[0],
            status: SaleStatus.PENDING,
        },
    });
    const handleFormSubmit = (data) => {
        onSubmit({
            ...data,
            saleDate: new Date(data.saleDate),
        });
    };
    // Filter available vehicles for new sales
    const availableVehicles = vehicles.filter((v) => v.status === VehicleStatus.AVAILABLE ||
        (sale && v.id === sale.vehicleId));
    return (_jsxs(ModalForm, { title: sale ? 'Edit Sale' : 'New Sale', onCancel: onCancel, onSubmit: handleSubmit(handleFormSubmit), submitLabel: sale ? 'Update Sale' : 'Create Sale', isLoading: isLoading, children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "vehicleId", className: "label", children: "Vehicle *" }), _jsxs("select", { id: "vehicleId", ...register('vehicleId', { required: 'Vehicle is required' }), className: "input", children: [_jsx("option", { value: "", children: "Select vehicle" }), availableVehicles?.map((vehicle) => (_jsxs("option", { value: vehicle.id, children: [vehicle.year, " ", vehicle.make, " ", vehicle.model, " - $", vehicle.price] }, vehicle.id)))] }), errors.vehicleId && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.vehicleId.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "customerId", className: "label", children: "Customer *" }), _jsxs("select", { id: "customerId", ...register('customerId', { required: 'Customer is required' }), className: "input", children: [_jsx("option", { value: "", children: "Select customer" }), customers?.map((customer) => (_jsxs("option", { value: customer.id, children: [customer.firstName, " ", customer.lastName] }, customer.id)))] }), errors.customerId && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.customerId.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "salePrice", className: "label", children: "Sale Price *" }), _jsx("input", { id: "salePrice", type: "number", step: "0.01", ...register('salePrice', {
                                    required: 'Sale price is required',
                                    valueAsNumber: true,
                                }), className: "input", placeholder: "28000.00" }), errors.salePrice && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.salePrice.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "saleDate", className: "label", children: "Sale Date *" }), _jsx("input", { id: "saleDate", type: "date", ...register('saleDate', { required: 'Sale date is required' }), className: "input" }), errors.saleDate && (_jsx("p", { className: "text-red-600 text-sm mt-1", children: errors.saleDate.message }))] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "paymentMethod", className: "label", children: "Payment Method" }), _jsxs("select", { id: "paymentMethod", ...register('paymentMethod'), className: "input", children: [_jsx("option", { value: "", children: "Select payment method" }), _jsx("option", { value: "Cash", children: "Cash" }), _jsx("option", { value: "Financing", children: "Financing" }), _jsx("option", { value: "Lease", children: "Lease" }), _jsx("option", { value: "Check", children: "Check" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "status", className: "label", children: "Status *" }), _jsxs("select", { id: "status", ...register('status'), className: "input", children: [_jsx("option", { value: SaleStatus.PENDING, children: "Pending" }), _jsx("option", { value: SaleStatus.COMPLETED, children: "Completed" }), _jsx("option", { value: SaleStatus.CANCELLED, children: "Cancelled" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "downPayment", className: "label", children: "Down Payment" }), _jsx("input", { id: "downPayment", type: "number", step: "0.01", ...register('downPayment', { valueAsNumber: true }), className: "input", placeholder: "5000.00" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "tradeInValue", className: "label", children: "Trade-In Value" }), _jsx("input", { id: "tradeInValue", type: "number", step: "0.01", ...register('tradeInValue', { valueAsNumber: true }), className: "input", placeholder: "3000.00" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "tradeInVehicle", className: "label", children: "Trade-In Vehicle" }), _jsx("input", { id: "tradeInVehicle", ...register('tradeInVehicle'), className: "input", placeholder: "2015 Honda Civic" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "notes", className: "label", children: "Notes" }), _jsx("textarea", { id: "notes", ...register('notes'), className: "input", rows: 3, placeholder: "Additional notes about the sale..." })] }), _jsx("input", { type: "hidden", ...register('salespersonId') })] }));
};
//# sourceMappingURL=SaleForm.js.map