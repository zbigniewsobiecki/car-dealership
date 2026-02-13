import { CreateVehicleDto, UpdateVehicleDto, VehicleFilters, VehicleStats } from '@car-dealership/shared-types';
export declare const useVehicles: (filters?: VehicleFilters) => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").PaginatedResponse<import("@car-dealership/shared-types").Vehicle>, Error>;
export declare const useVehicle: (id: string) => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").Vehicle, Error>;
export declare const useCreateVehicle: () => import("@tanstack/react-query").UseMutationResult<import("@car-dealership/shared-types").Vehicle, Error, CreateVehicleDto, unknown>;
export declare const useUpdateVehicle: () => import("@tanstack/react-query").UseMutationResult<import("@car-dealership/shared-types").Vehicle, Error, {
    id: string;
    data: UpdateVehicleDto;
}, unknown>;
export declare const useDeleteVehicle: () => import("@tanstack/react-query").UseMutationResult<void, Error, string, unknown>;
export declare const useVehicleStats: () => import("@tanstack/react-query").UseQueryResult<VehicleStats, Error>;
export declare const useRecentVehicles: (limit?: number) => import("@tanstack/react-query").UseQueryResult<import("@car-dealership/shared-types").Vehicle[], Error>;
//# sourceMappingURL=useVehicles.d.ts.map