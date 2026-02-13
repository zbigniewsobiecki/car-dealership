import { query } from './db.js';
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleStats,
} from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';

class VehicleRepository extends BaseRepository<Vehicle, CreateVehicleDto, UpdateVehicleDto> {
  constructor() {
    super({
      tableName: 'vehicles',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'price', 'year', 'mileage', 'make', 'model'],
      allowedFilterFields: [
        'make', 'model', 'yearMin', 'yearMax', 'priceMin', 'priceMax', 
        'status', 'condition', 'type', 'search', 'bodyType', 'fuelType', 'transmission'
      ],
    });
  }

  async findByVin(vin: string): Promise<Vehicle | null> {
    const result = await query('SELECT * FROM vehicles WHERE vin = $1', [vin]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findRecent(limit: number): Promise<Vehicle[]> {
    const result = await query(
      'SELECT * FROM vehicles ORDER BY created_at DESC LIMIT $1',
      [limit]
    );
    return result.rows.map(row => this.mapRow(row));
  }

  async getStats(): Promise<VehicleStats> {
    const result = await query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'available') as available,
        COUNT(*) FILTER (WHERE status = 'sold') as sold,
        COUNT(*) FILTER (WHERE status = 'reserved') as reserved,
        COUNT(*) FILTER (WHERE status = 'maintenance') as maintenance,
        COALESCE(SUM(price) FILTER (WHERE status = 'available'), 0) as total_inventory_value
      FROM vehicles
    `);

    const row = result.rows[0];
    return {
      total: parseInt(row.total),
      available: parseInt(row.available),
      sold: parseInt(row.sold),
      reserved: parseInt(row.reserved),
      maintenance: parseInt(row.maintenance),
      total_inventory_value: parseFloat(row.total_inventory_value),
    };
  }

  protected buildWhereClause(key: string, value: unknown, paramCount: number): { sql: string; value: unknown } | null {
    switch (key) {
      case 'make':
      case 'model':
      case 'type':
        return { sql: `LOWER(${key}) = LOWER($${paramCount})`, value };
      case 'yearMin':
        return { sql: `year >= $${paramCount}`, value };
      case 'yearMax':
        return { sql: `year <= $${paramCount}`, value };
      case 'priceMin':
        return { sql: `price >= $${paramCount}`, value };
      case 'priceMax':
        return { sql: `price <= $${paramCount}`, value };
      case 'search':
        return {
          sql: `(LOWER(make) LIKE LOWER($${paramCount}) OR LOWER(model) LIKE LOWER($${paramCount}) OR LOWER(vin) LIKE LOWER($${paramCount}))`,
          value: `%${value}%`
        };
      default:
        return super.buildWhereClause(key, value, paramCount);
    }
  }
}

export const VehicleModel = new VehicleRepository();