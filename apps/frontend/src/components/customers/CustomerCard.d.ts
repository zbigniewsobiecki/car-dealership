import { Customer } from '@car-dealership/shared-types';
interface CustomerCardProps {
    customer: Customer;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
}
export declare const CustomerCard: ({ customer, onEdit, onDelete }: CustomerCardProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CustomerCard.d.ts.map