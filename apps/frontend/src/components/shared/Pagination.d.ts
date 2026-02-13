import React from 'react';
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}
export declare const Pagination: React.FC<PaginationProps>;
export {};
//# sourceMappingURL=Pagination.d.ts.map