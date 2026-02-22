import { query } from './db.js';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';

class CustomerRepository extends BaseRepository<Customer, CreateCustomerDto, UpdateCustomerDto> {
  constructor() {
    super({
      tableName: 'customers',
      softDelete: true,
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'first_name', 'last_name', 'email'],
      allowedFilterFields: ['first_name', 'last_name', 'email', 'city', 'state'],
    });
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM customers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}

export const CustomerModel = new CustomerRepository();