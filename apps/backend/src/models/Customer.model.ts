import { query } from './db.js';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';
import { BaseRepository, BaseFilters } from './BaseRepository.js';

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

  async findAll(filters: BaseFilters = {}): Promise<{ data: Customer[]; total: number }> {
    return super.findAll(filters);
  }

  async create(data: CreateCustomerDto, createdBy?: string): Promise<Customer> {
    const dbData: Record<string, unknown> = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      zip_code: data.zipCode || null,
      notes: data.notes || null,
    };

    return super.create(dbData, createdBy);
  }

  async update(id: string, data: UpdateCustomerDto): Promise<Customer | null> {
    const dbData: Record<string, unknown> = {};

    if (data.firstName !== undefined) dbData.first_name = data.firstName;
    if (data.lastName !== undefined) dbData.last_name = data.lastName;
    if (data.email !== undefined) dbData.email = data.email;
    if (data.phone !== undefined) dbData.phone = data.phone;
    if (data.address !== undefined) dbData.address = data.address;
    if (data.city !== undefined) dbData.city = data.city;
    if (data.state !== undefined) dbData.state = data.state;
    if (data.zipCode !== undefined) dbData.zip_code = data.zipCode;
    if (data.notes !== undefined) dbData.notes = data.notes;

    return super.update(id, dbData);
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM customers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  protected mapRow(row: Record<string, unknown>): Customer {
    return {
      id: row.id as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      email: row.email as string | undefined,
      phone: row.phone as string | undefined,
      address: row.address as string | undefined,
      city: row.city as string | undefined,
      state: row.state as string | undefined,
      zipCode: row.zip_code as string | undefined,
      notes: row.notes as string | undefined,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
      deletedAt: row.deleted_at as Date | undefined,
      createdBy: row.created_by as string | undefined,
    };
  }
}

export const CustomerModel = new CustomerRepository();