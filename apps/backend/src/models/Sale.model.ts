import { query } from './db.js';
import { Sale, UpdateSaleDto } from '@car-dealership/shared-types';
import { BaseRepository, BaseFilters } from './BaseRepository.js';

class SaleRepository extends BaseRepository<Sale> {
  constructor() {
    super({
      tableName: 'sales',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
    });
  }

  async findAll(filters: BaseFilters = {}): Promise<{ data: Sale[]; total: number }> {
    return super.findAll(filters);
  }

  async findByCustomerId(customerId: string): Promise<Sale[]> {
    const result = await query(
      'SELECT * FROM sales WHERE customer_id = $1 ORDER BY created_at DESC',
      [customerId]
    );
    return result.rows.map(row => this.mapRow(row));
  }

  async create(data: Record<string, unknown>, _createdBy?: string): Promise<Sale> {
    const dbData: Record<string, unknown> = {
      vehicle_id: data.vehicleId,
      customer_id: data.customerId,
      salesperson_id: data.salespersonId,
      sale_price: data.salePrice,
      sale_date: data.saleDate,
      payment_method: data.paymentMethod || null,
      financing_details: data.financingDetails ? JSON.stringify(data.financingDetails) : null,
      trade_in_vehicle: data.tradeInVehicle || null,
      trade_in_value: data.tradeInValue || null,
      down_payment: data.downPayment || null,
      status: data.status,
      notes: data.notes || null,
    };

    return super.create(dbData);
  }

  async update(id: string, data: UpdateSaleDto): Promise<Sale | null> {
    const dbData: Record<string, unknown> = {};

    if (data.vehicleId !== undefined) dbData.vehicle_id = data.vehicleId;
    if (data.customerId !== undefined) dbData.customer_id = data.customerId;
    if (data.salespersonId !== undefined) dbData.salesperson_id = data.salespersonId;
    if (data.salePrice !== undefined) dbData.sale_price = data.salePrice;
    if (data.saleDate !== undefined) dbData.sale_date = data.saleDate;
    if (data.paymentMethod !== undefined) dbData.payment_method = data.paymentMethod;
    if (data.financingDetails !== undefined) dbData.financing_details = JSON.stringify(data.financingDetails);
    if (data.tradeInVehicle !== undefined) dbData.trade_in_vehicle = data.tradeInVehicle;
    if (data.tradeInValue !== undefined) dbData.trade_in_value = data.tradeInValue;
    if (data.downPayment !== undefined) dbData.down_payment = data.downPayment;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.notes !== undefined) dbData.notes = data.notes;

    return super.update(id, dbData);
  }

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
  }

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
  }

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
  }

  protected mapRow(row: Record<string, unknown>): Sale {
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
  }
}

export const SaleModel = new SaleRepository();