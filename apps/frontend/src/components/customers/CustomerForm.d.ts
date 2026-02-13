import { Customer, CreateCustomerDto } from '@car-dealership/shared-types';
interface CustomerFormProps {
    customer?: Customer;
    onSubmit: (data: CreateCustomerDto) => void;
    onCancel: () => void;
    isLoading?: boolean;
}
export declare const CustomerForm: ({ customer, onSubmit, onCancel, isLoading, }: CustomerFormProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CustomerForm.d.ts.map