import { useState } from 'react';
import { VehicleFilters, VehicleType } from '@car-dealership/shared-types';

export const useVehicleFilters = (initialLimit = 10) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<VehicleType | ''>('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VehicleFilters>({ page: 1, limit: initialLimit });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: VehicleFilters = { ...filters, search: searchTerm, page: 1 };

    if (type) {
      newFilters.type = type as VehicleType;
    } else {
      delete newFilters.type;
    }

    if (priceMin) {
      newFilters.priceMin = Number(priceMin);
    } else {
      delete newFilters.priceMin;
    }

    if (priceMax) {
      newFilters.priceMax = Number(priceMax);
    } else {
      delete newFilters.priceMax;
    }

    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setFilters({ ...filters, page: newPage });
    window.scrollTo(0, 0);
  };

  const handleClear = () => {
    setSearchTerm('');
    setType('');
    setPriceMin('');
    setPriceMax('');
    setPage(1);
    setFilters({ page: 1, limit: initialLimit });
  };

  const isFiltered = !!(filters.search || filters.type || filters.priceMin !== undefined || filters.priceMax !== undefined);

  return {
    searchTerm,
    setSearchTerm,
    type,
    setType,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    page,
    filters,
    handleSearch,
    handlePageChange,
    handleClear,
    isFiltered,
    limit: initialLimit,
  };
};