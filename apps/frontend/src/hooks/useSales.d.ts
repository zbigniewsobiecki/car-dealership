import { CreateSaleDto, UpdateSaleDto } from '@car-dealership/shared-types';
export declare const useSales: () => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").Sale[], Error>;
export declare const useSale: (id: string) => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").Sale, Error>;
export declare const useCreateSale: () => import("@tanstack/react-query").UseMutationResult<import("@car-dealership/shared-types").Sale, Error, CreateSaleDto, unknown>;
export declare const useUpdateSale: () => import("@tanstack/react-query").UseMutationResult<import("@car-dealership/shared-types").Sale, Error, {
    id: string;
    data: UpdateSaleDto;
}, unknown>;
export declare const useDeleteSale: () => import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
export declare const useSalesStats: () => import("@tanstack/react-query").UseQueryResult<any, Error>;
//# sourceMappingURL=useSales.d.ts.map