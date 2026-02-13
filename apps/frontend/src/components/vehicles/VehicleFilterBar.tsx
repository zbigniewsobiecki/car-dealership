import React from 'react';
import { Search } from 'lucide-react';

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

export const VehicleFilterBar: React.FC<VehicleFilterBarProps> = ({
  searchTerm,
  onSearchTermChange,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  onSearch,
  onClear,
  isFiltered,
}) => {
  return (
    <div className="card mb-6">
      <form onSubmit={onSearch} className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by make, model, or VIN..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          <input
            type="number"
            placeholder="Min Price"
            className="input w-32"
            value={priceMin}
            onChange={(e) => onPriceMinChange(e.target.value)}
            min="0"
          />
          <input
            type="number"
            placeholder="Max Price"
            className="input w-32"
            value={priceMax}
            onChange={(e) => onPriceMaxChange(e.target.value)}
            min="0"
          />
        </div>
        <div className="flex space-x-3">
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {isFiltered && (
            <button
              type="button"
              onClick={onClear}
              className="btn btn-secondary"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};