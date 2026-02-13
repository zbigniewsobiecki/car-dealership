import { query } from './db.js';
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleStats,
} from '@car-dealership/shared-types';
import { BaseRepository, BaseFilters } from './BaseRepository.js';

class VehicleRepository extends BaseRepository<Vehicle, CreateVehicleDto, UpdateVehicleDto> {
  constructor() {
    super({
      tableName: 'vehicles',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'price', 'year', 'mileage', 'make', 'model'],
      allowedFilterFields: [
        'make', 'model', 'yearMin', 'yearMax', 'priceMin', 'priceMax', 
        'status', 'condition', 'search', 'bodyType', 'fuelType', 'transmission'
      ],
    });
  }

  async findAll(filters: BaseFilters = {}): Promise<{ data: Vehicle[]; total: number }> {
    return super.findAll(filters);
  }

  async findByVin(vin: string): Promise<Vehicle | null> {
    const result = await query('SELECT * FROM vehicles WHERE vin = $1', [vin]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async create(data: CreateVehicleDto, createdBy?: string): Promise<Vehicle> {
    const dbData: Record<string, unknown> = {
      vin: data.vin,
      make: data.make,
      model: data.model,
      year: data.year,
      color: data.color,
      mileage: data.mileage || null,
      price: data.price,
      cost: data.cost || null,
      status: data.status,
      condition: data.condition || null,
      body_type: data.bodyType || null,
      transmission: data.transmission || null,
      fuel_type: data.fuelType || null,
      engine: data.engine || null,
      drivetrain: data.drivetrain || null,
      exterior_color: data.exteriorColor || null,
      interior_color: data.interiorColor || null,
      features: data.features ? JSON.stringify(data.features) : null,
      description: data.description || null,
      images: data.images ? JSON.stringify(data.images) : null,
      date_acquired: data.dateAcquired || null,
    };

    return super.create(dbData, createdBy);
  }

  async update(id: string, data: UpdateVehicleDto): Promise<Vehicle | null> {
    const dbData: Record<string, unknown> = {};
    
    if (data.vin !== undefined) dbData.vin = data.vin;
    if (data.make !== undefined) dbData.make = data.make;
    if (data.model !== undefined) dbData.model = data.model;
    if (data.year !== undefined) dbData.year = data.year;
    if (data.color !== undefined) dbData.color = data.color;
    if (data.mileage !== undefined) dbData.mileage = data.mileage;
    if (data.price !== undefined) dbData.price = data.price;
    if (data.cost !== undefined) dbData.cost = data.cost;
    if (data.status !== undefined) dbData.status = data.status;
    if (data.condition !== undefined) dbData.condition = data.condition;
    if (data.bodyType !== undefined) dbData.body_type = data.bodyType;
    if (data.transmission !== undefined) dbData.transmission = data.transmission;
    if (data.fuelType !== undefined) dbData.fuel_type = data.fuelType;
    if (data.engine !== undefined) dbData.engine = data.engine;
    if (data.drivetrain !== undefined) dbData.drivetrain = data.drivetrain;
    if (data.exteriorColor !== undefined) dbData.exterior_color = data.exteriorColor;
    if (data.interiorColor !== undefined) dbData.interior_color = data.interiorColor;
    if (data.features !== undefined) dbData.features = JSON.stringify(data.features);
    if (data.description !== undefined) dbData.description = data.description;
    if (data.dateAcquired !== undefined) dbData.date_acquired = data.dateAcquired;

    if (data.images !== undefined) dbData.images = data.images ? JSON.stringify(data.images) : null;

    return super.update(id, dbData);
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
      case 'status':
      case 'condition':
        return { sql: `${key} = $${paramCount}`, value };
      default:
        return super.buildWhereClause(key, value, paramCount);
    }
  }

  protected mapRow(row: Record<string, unknown>): Vehicle {
    return {
      id: row.id as string,
      vin: row.vin as string,
      make: row.make as string,
      model: row.model as string,
      year: row.year as number,
      color: row.color as string,
      mileage: row.mileage as number | undefined,
      price: parseFloat(row.price as string),
      cost: row.cost ? parseFloat(row.cost as string) : undefined,
      status: row.status as Vehicle['status'],
      condition: row.condition as Vehicle['condition'] | undefined,
      bodyType: row.body_type as string | undefined,
      transmission: row.transmission as string | undefined,
      fuelType: row.fuel_type as string | undefined,
      engine: row.engine as string | undefined,
      drivetrain: row.drivetrain as string | undefined,
      exteriorColor: row.exterior_color as string | undefined,
      interiorColor: row.interior_color as string | undefined,
      features: row.features as Record<string, unknown> | undefined,
      description: row.description as string | undefined,
      images: row.images as Vehicle['images'],
      dateAcquired: row.date_acquired as Date | undefined,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
      createdBy: row.created_by as string | undefined,
    };
  }
}

export const VehicleModel = new VehicleRepository();