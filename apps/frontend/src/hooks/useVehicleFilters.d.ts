import { VehicleFilters, VehicleType } from '@car-dealership/shared-types';
export declare const useVehicleFilters: (initialLimit?: number) => {
    searchTerm: string;
    setSearchTerm: import("react").Dispatch<import("react").SetStateAction<string>>;
    type: "" | VehicleType;
    setType: import("react").Dispatch<import("react").SetStateAction<"" | VehicleType>>;
    priceMin: string;
    setPriceMin: import("react").Dispatch<import("react").SetStateAction<string>>;
    priceMax: string;
    setPriceMax: import("react").Dispatch<import("react").SetStateAction<string>>;
    page: number;
    filters: VehicleFilters;
    handleSearch: (e: React.FormEvent) => void;
    handlePageChange: (newPage: number) => void;
    handleClear: () => void;
    isFiltered: boolean;
    limit: number;
};
//# sourceMappingURL=useVehicleFilters.d.ts.map