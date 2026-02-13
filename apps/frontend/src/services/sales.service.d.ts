import { Sale, CreateSaleDto, UpdateSaleDto } from '@car-dealership/shared-types';
export declare const salesService: {
    getAll(): Promise<Sale[]>;
    getById(id: string): Promise<Sale>;
    create(data: CreateSaleDto): Promise<Sale>;
    update(id: string, data: UpdateSaleDto): Promise<Sale>;
    delete(id: string): Promise<void>;
    getStats(): Promise<any>;
    getMonthlyStats(): Promise<any>;
};
//# sourceMappingURL=sales.service.d.ts.map