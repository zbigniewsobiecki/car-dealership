import { Vehicle, CreateVehicleDto, UpdateVehicleDto, VehicleFilters, VehicleStats, PaginatedResponse } from '@car-dealership/shared-types';
export declare const vehiclesService: {
    getAll(filters?: VehicleFilters): Promise<PaginatedResponse<Vehicle>>;
    getById(id: string): Promise<Vehicle>;
    create(data: CreateVehicleDto): Promise<Vehicle>;
    update(id: string, data: UpdateVehicleDto): Promise<Vehicle>;
    delete(id: string): Promise<void>;
    getStats(): Promise<VehicleStats>;
    getRecent(limit?: number): Promise<Vehicle[]>;
};
//# sourceMappingURL=vehicles.service.d.ts.map