import { useState } from 'react';
import { RepairFilters, RepairStatus } from '@car-dealership/shared-types';

export const useRepairFilters = (initialLimit = 10) => {
  const [status, setStatus] = useState('');
  const [technician, setTechnician] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<RepairFilters & { page: number; limit: number }>({ page: 1, limit: initialLimit });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters: RepairFilters & { page: number; limit: number } = { page: 1, limit: initialLimit };

    if (status) {
      newFilters.status = status as RepairStatus;
    }

    if (technician.trim()) {
      newFilters.technician = technician.trim();
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
    setStatus('');
    setTechnician('');
    setPage(1);
    setFilters({ page: 1, limit: initialLimit });
  };

  const isFiltered = !!(
    filters.status !== undefined ||
    filters.technician !== undefined
  );

  return {
    status,
    setStatus,
    technician,
    setTechnician,
    page,
    filters,
    handleSearch,
    handlePageChange,
    handleClear,
    isFiltered,
    limit: initialLimit,
  };
};
