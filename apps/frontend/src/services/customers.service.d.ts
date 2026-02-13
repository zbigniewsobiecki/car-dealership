import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';
export declare const customersService: {
    getAll(): Promise<Customer[]>;
    getById(id: string): Promise<Customer>;
    create(data: CreateCustomerDto): Promise<Customer>;
    update(id: string, data: UpdateCustomerDto): Promise<Customer>;
    delete(id: string): Promise<void>;
    getSales(id: string): Promise<any>;
};
//# sourceMappingURL=customers.service.d.ts.map