import { Vehicle, CreateVehicleDto } from '@car-dealership/shared-types';
interface VehicleFormProps {
    vehicle?: Vehicle;
    onSubmit: (data: CreateVehicleDto) => void;
    onCancel: () => void;
    isLoading?: boolean;
}
export declare const VehicleForm: ({ vehicle, onSubmit, onCancel, isLoading, }: VehicleFormProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=VehicleForm.d.ts.map