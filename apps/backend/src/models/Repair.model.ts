import { query } from './db.js';
import {
  Repair,
  CreateRepairDto,
  UpdateRepairDto,
  RepairStats,
} from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';

class RepairRepository extends BaseRepository<Repair, CreateRepairDto, UpdateRepairDto> {
  constructor() {
    super({
      tableName: 'repairs',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'estimated_completion_date', 'actual_completion_date', 'status'],
      allowedFilterFields: [
        'vehicleId', 'customerId', 'status', 'dateFrom', 'dateTo', 'search'
      ],
    });
  }

  async findByVehicleId(vehicleId: string): Promise<Repair[]> {
    const result = await query(
      'SELECT * FROM repairs WHERE vehicle_id = $1 ORDER BY created_at DESC',
      [vehicleId]
    );
    return result.rows.map(row => this.dataMapper.mapRow<Repair>(row));
  }

  async findByCustomerId(customerId: string): Promise<Repair[]> {
    const result = await query(
      'SELECT * FROM repairs WHERE customer_id = $1 ORDER BY created_at DESC',
      [customerId]
    );
    return result.rows.map(row => this.dataMapper.mapRow<Repair>(row));
  }

  async findActive(limit?: number): Promise<Repair[]> {
    const sql = `
      SELECT * FROM repairs
      WHERE status IN ('pending', 'in_progress')
      ORDER BY created_at DESC
      ${limit ? `LIMIT $1` : ''}
    `;
    const result = await query(sql, limit ? [limit] : []);
    return result.rows.map(row => this.dataMapper.mapRow<Repair>(row));
  }

  async getStats(): Promise<RepairStats> {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
        COALESCE(SUM(estimated_cost), 0) as total_estimated_cost,
        COALESCE(SUM(actual_cost), 0) as total_actual_cost
      FROM repairs
    `);

    const row = result.rows[0];
    return {
      total: parseInt(row.total),
      pending: parseInt(row.pending),
      in_progress: parseInt(row.in_progress),
      completed: parseInt(row.completed),
      cancelled: parseInt(row.cancelled),
      total_estimated_cost: parseFloat(row.total_estimated_cost),
      total_actual_cost: parseFloat(row.total_actual_cost),
    };
  }

  protected buildWhereClause(key: string, value: unknown, paramCount: number): { sql: string; value: unknown } | null {
    switch (key) {
      case 'vehicleId':
        return { sql: `vehicle_id = $${paramCount}`, value };
      case 'customerId':
        return { sql: `customer_id = $${paramCount}`, value };
      case 'status':
        return { sql: `status = $${paramCount}`, value };
      case 'dateFrom':
        return { sql: `created_at >= $${paramCount}`, value };
      case 'dateTo':
        return { sql: `created_at <= $${paramCount}`, value };
      case 'search':
        return {
          sql: `(LOWER(description) LIKE LOWER($${paramCount}) OR LOWER(notes) LIKE LOWER($${paramCount}))`,
          value: `%${value}%`
        };
      default:
        return super.buildWhereClause(key, value, paramCount);
    }
  }
}

export const RepairModel = new RepairRepository();
