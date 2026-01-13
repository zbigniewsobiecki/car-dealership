import { query } from './db.js';
import { Customer, CreateCustomerDto, UpdateCustomerDto } from '@car-dealership/shared-types';

export const CustomerModel = {
  async findAll(): Promise<Customer[]> {
    const result = await query('SELECT * FROM customers ORDER BY created_at DESC');
    return result.rows.map(CustomerModel.mapRow);
  },

  async findById(id: string): Promise<Customer | null> {
    const result = await query('SELECT * FROM customers WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return CustomerModel.mapRow(result.rows[0]);
  },

  async create(data: CreateCustomerDto, createdBy: string): Promise<Customer> {
    const result = await query(
      `INSERT INTO customers (
        first_name, last_name, email, phone, address, city, state, zip_code, notes, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        data.firstName,
        data.lastName,
        data.email || null,
        data.phone || null,
        data.address || null,
        data.city || null,
        data.state || null,
        data.zipCode || null,
        data.notes || null,
        createdBy,
      ]
    );

    return CustomerModel.mapRow(result.rows[0]);
  },

  async update(id: string, data: UpdateCustomerDto): Promise<Customer | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(data.lastName);
    }
    if (data.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.address !== undefined) {
      fields.push(`address = $${paramCount++}`);
      values.push(data.address);
    }
    if (data.city !== undefined) {
      fields.push(`city = $${paramCount++}`);
      values.push(data.city);
    }
    if (data.state !== undefined) {
      fields.push(`state = $${paramCount++}`);
      values.push(data.state);
    }
    if (data.zipCode !== undefined) {
      fields.push(`zip_code = $${paramCount++}`);
      values.push(data.zipCode);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(data.notes);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return CustomerModel.mapRow(result.rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM customers WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  mapRow(row: Record<string, unknown>): Customer {
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
      createdBy: row.created_by as string | undefined,
    };
  },
};
