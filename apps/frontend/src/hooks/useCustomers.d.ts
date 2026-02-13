import { CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';
export declare const useCustomers: () => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").Customer[], Error>;
export declare const useCustomer: (id: string) => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").Customer, Error>;
export declare const useCreateCustomer: () => import("@tanstack/react-query").UseMutationResult<import("@car-dealership/shared-types").Customer, Error, CreateCustomerDto, unknown>;
export declare const useUpdateCustomer: () => import("@tanstack/react-query").UseMutationResult<import("@car-dealership/shared-types").Customer, Error, {
    id: string;
    data: UpdateCustomerDto;
}, unknown>;
export declare const useDeleteCustomer: () => import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
//# sourceMappingURL=useCustomers.d.ts.map