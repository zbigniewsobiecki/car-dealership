import { query } from './db.js';
import { Sale, CreateSaleDto, UpdateSaleDto } from '@car-dealership/shared-types';

export const SaleModel = {
  async findAll(): Promise<Sale[]> {
    const result = await query('SELECT * FROM sales ORDER BY created_at DESC');
    return result.rows.map(SaleModel.mapRow);
  },

  async findById(id: string): Promise<Sale | null> {
    const result = await query('SELECT * FROM sales WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return SaleModel.mapRow(result.rows[0]);
  },

  async findByCustomerId(customerId: string): Promise<Sale[]> {
    const result = await query(
      'SELECT * FROM sales WHERE customer_id = $1 ORDER BY created_at DESC',
      [customerId]
    );
    return result.rows.map(SaleModel.mapRow);
  },

  async create(data: CreateSaleDto): Promise<Sale> {
    const result = await query(
      `INSERT INTO sales (
        vehicle_id, customer_id, salesperson_id, sale_price, sale_date,
        payment_method, financing_details, trade_in_vehicle, trade_in_value,
        down_payment, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        data.vehicleId,
        data.customerId,
        data.salespersonId,
        data.salePrice,
        data.saleDate,
        data.paymentMethod || null,
        data.financingDetails ? JSON.stringify(data.financingDetails) : null,
        data.tradeInVehicle || null,
        data.tradeInValue || null,
        data.downPayment || null,
        data.status,
        data.notes || null,
      ]
    );

    return SaleModel.mapRow(result.rows[0]);
  },

  async update(id: string, data: UpdateSaleDto): Promise<Sale | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.vehicleId !== undefined) {
      fields.push(`vehicle_id = $${paramCount++}`);
      values.push(data.vehicleId);
    }
    if (data.customerId !== undefined) {
      fields.push(`customer_id = $${paramCount++}`);
      values.push(data.customerId);
    }
    if (data.salespersonId !== undefined) {
      fields.push(`salesperson_id = $${paramCount++}`);
      values.push(data.salespersonId);
    }
    if (data.salePrice !== undefined) {
      fields.push(`sale_price = $${paramCount++}`);
      values.push(data.salePrice);
    }
    if (data.saleDate !== undefined) {
      fields.push(`sale_date = $${paramCount++}`);
      values.push(data.saleDate);
    }
    if (data.paymentMethod !== undefined) {
      fields.push(`payment_method = $${paramCount++}`);
      values.push(data.paymentMethod);
    }
    if (data.financingDetails !== undefined) {
      fields.push(`financing_details = $${paramCount++}`);
      values.push(JSON.stringify(data.financingDetails));
    }
    if (data.tradeInVehicle !== undefined) {
      fields.push(`trade_in_vehicle = $${paramCount++}`);
      values.push(data.tradeInVehicle);
    }
    if (data.tradeInValue !== undefined) {
      fields.push(`trade_in_value = $${paramCount++}`);
      values.push(data.tradeInValue);
    }
    if (data.downPayment !== undefined) {
      fields.push(`down_payment = $${paramCount++}`);
      values.push(data.downPayment);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(data.notes);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query(
      `UPDATE sales SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return SaleModel.mapRow(result.rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM sales WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async getStats() {
    const result = await query(`
      SELECT
        COUNT(*) as total_sales,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_sales,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_sales,
        COALESCE(SUM(sale_price) FILTER (WHERE status = 'completed'), 0) as total_revenue,
        COALESCE(AVG(sale_price) FILTER (WHERE status = 'completed'), 0) as average_sale_price
      FROM sales
    `);

    return result.rows[0];
  },

  async getMonthlyStats() {
    const result = await query(`
      SELECT
        DATE_TRUNC('month', sale_date) as month,
        COUNT(*) as sales_count,
        SUM(sale_price) as revenue
      FROM sales
      WHERE status = 'completed' AND sale_date >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', sale_date)
      ORDER BY month DESC
    `);

    return result.rows;
  },

  async getRevenueReport(startDate: Date, endDate: Date) {
    const result = await query(
      `
      SELECT
        COALESCE(SUM(sale_price), 0) as total_revenue,
        COUNT(*) as sale_count,
        COALESCE(AVG(sale_price), 0) as average_sale_price
      FROM sales
      WHERE status = 'completed'
        AND sale_date >= $1
        AND sale_date <= $2
      `,
      [startDate, endDate]
    );

    const row = result.rows[0];
    return {
      totalRevenue: parseFloat(row.total_revenue),
      saleCount: parseInt(row.sale_count, 10),
      averageSalePrice: parseFloat(row.average_sale_price),
    };
  },

  mapRow(row: Record<string, unknown>): Sale {
    return {
      id: row.id as string,
      vehicleId: row.vehicle_id as string,
      customerId: row.customer_id as string,
      salespersonId: row.salesperson_id as string,
      salePrice: parseFloat(row.sale_price as string),
      saleDate: row.sale_date as Date,
      paymentMethod: row.payment_method as string | undefined,
      financingDetails: row.financing_details as Record<string, unknown> | undefined,
      tradeInVehicle: row.trade_in_vehicle as string | undefined,
      tradeInValue: row.trade_in_value ? parseFloat(row.trade_in_value as string) : undefined,
      downPayment: row.down_payment ? parseFloat(row.down_payment as string) : undefined,
      status: row.status as Sale['status'],
      notes: row.notes as string | undefined,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
    };
  },
};
