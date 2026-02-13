import { Sale, CreateSaleDto } from '@car-dealership/shared-types';
interface SaleFormProps {
    sale?: Sale;
    onSubmit: (data: CreateSaleDto) => void;
    onCancel: () => void;
    isLoading?: boolean;
}
export declare const SaleForm: ({ sale, onSubmit, onCancel, isLoading }: SaleFormProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SaleForm.d.ts.map