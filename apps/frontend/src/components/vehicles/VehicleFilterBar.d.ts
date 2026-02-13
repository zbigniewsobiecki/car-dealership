import React from 'react';
interface VehicleFilterBarProps {
    searchTerm: string;
    onSearchTermChange: (value: string) => void;
    priceMin: string;
    onPriceMinChange: (value: string) => void;
    priceMax: string;
    onPriceMaxChange: (value: string) => void;
    onSearch: (e: React.FormEvent) => void;
    onClear: () => void;
    isFiltered: boolean;
}
export declare const VehicleFilterBar: React.FC<VehicleFilterBarProps>;
export {};
//# sourceMappingURL=VehicleFilterBar.d.ts.map