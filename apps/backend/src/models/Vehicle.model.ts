import { query } from './db.js';
import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
} from '@car-dealership/shared-types';

export const VehicleModel = {
  async findAll(filters?: VehicleFilters): Promise<{ vehicles: Vehicle[]; total: number }> {
    let sql = 'SELECT *, COUNT(*) OVER() as full_count FROM vehicles WHERE 1=1';
    const values: unknown[] = [];
    let paramCount = 1;

    if (filters?.make) {
      sql += ` AND LOWER(make) = LOWER($${paramCount++})`;
      values.push(filters.make);
    }
    if (filters?.model) {
      sql += ` AND LOWER(model) = LOWER($${paramCount++})`;
      values.push(filters.model);
    }
    if (filters?.yearMin) {
      sql += ` AND year >= $${paramCount++}`;
      values.push(filters.yearMin);
    }
    if (filters?.yearMax) {
      sql += ` AND year <= $${paramCount++}`;
      values.push(filters.yearMax);
    }
    if (filters?.priceMin) {
      sql += ` AND price >= $${paramCount++}`;
      values.push(filters.priceMin);
    }
    if (filters?.priceMax) {
      sql += ` AND price <= $${paramCount++}`;
      values.push(filters.priceMax);
    }
    if (filters?.status) {
      sql += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }
    if (filters?.condition) {
      sql += ` AND condition = $${paramCount++}`;
      values.push(filters.condition);
    }
    if (filters?.search) {
      sql += ` AND (LOWER(make) LIKE LOWER($${paramCount}) OR LOWER(model) LIKE LOWER($${paramCount}) OR LOWER(vin) LIKE LOWER($${paramCount}))`;
      values.push(`%${filters.search}%`);
      paramCount++;
    }

    sql += ' ORDER BY created_at DESC';

    if (filters?.limit) {
      const limit = parseInt(filters.limit.toString());
      const page = filters.page ? parseInt(filters.page.toString()) : 1;
      const offset = (page - 1) * limit;

      sql += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      values.push(limit, offset);
    }

    const result = await query(sql, values);
    const total = result.rows.length > 0 ? parseInt(result.rows[0].full_count) : 0;

    return {
      vehicles: result.rows.map(VehicleModel.mapRow),
      total,
    };
  },

  async findById(id: string): Promise<Vehicle | null> {
    const result = await query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return VehicleModel.mapRow(result.rows[0]);
  },

  async findByVin(vin: string): Promise<Vehicle | null> {
    const result = await query('SELECT * FROM vehicles WHERE vin = $1', [vin]);
    if (result.rows.length === 0) return null;
    return VehicleModel.mapRow(result.rows[0]);
  },

  async create(data: CreateVehicleDto, createdBy: string): Promise<Vehicle> {
    const result = await query(
      `INSERT INTO vehicles (
        vin, make, model, year, color, mileage, price, cost, status, condition,
        body_type, transmission, fuel_type, engine, drivetrain, exterior_color,
        interior_color, features, description, date_acquired, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        data.vin,
        data.make,
        data.model,
        data.year,
        data.color,
        data.mileage || null,
        data.price,
        data.cost || null,
        data.status,
        data.condition || null,
        data.bodyType || null,
        data.transmission || null,
        data.fuelType || null,
        data.engine || null,
        data.drivetrain || null,
        data.exteriorColor || null,
        data.interiorColor || null,
        data.features ? JSON.stringify(data.features) : null,
        data.description || null,
        data.dateAcquired || null,
        createdBy,
      ]
    );

    return VehicleModel.mapRow(result.rows[0]);
  },

  async update(id: string, data: UpdateVehicleDto): Promise<Vehicle | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramCount = 1;

    if (data.vin !== undefined) {
      fields.push(`vin = $${paramCount++}`);
      values.push(data.vin);
    }
    if (data.make !== undefined) {
      fields.push(`make = $${paramCount++}`);
      values.push(data.make);
    }
    if (data.model !== undefined) {
      fields.push(`model = $${paramCount++}`);
      values.push(data.model);
    }
    if (data.year !== undefined) {
      fields.push(`year = $${paramCount++}`);
      values.push(data.year);
    }
    if (data.color !== undefined) {
      fields.push(`color = $${paramCount++}`);
      values.push(data.color);
    }
    if (data.mileage !== undefined) {
      fields.push(`mileage = $${paramCount++}`);
      values.push(data.mileage);
    }
    if (data.price !== undefined) {
      fields.push(`price = $${paramCount++}`);
      values.push(data.price);
    }
    if (data.cost !== undefined) {
      fields.push(`cost = $${paramCount++}`);
      values.push(data.cost);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.condition !== undefined) {
      fields.push(`condition = $${paramCount++}`);
      values.push(data.condition);
    }
    if (data.bodyType !== undefined) {
      fields.push(`body_type = $${paramCount++}`);
      values.push(data.bodyType);
    }
    if (data.transmission !== undefined) {
      fields.push(`transmission = $${paramCount++}`);
      values.push(data.transmission);
    }
    if (data.fuelType !== undefined) {
      fields.push(`fuel_type = $${paramCount++}`);
      values.push(data.fuelType);
    }
    if (data.engine !== undefined) {
      fields.push(`engine = $${paramCount++}`);
      values.push(data.engine);
    }
    if (data.drivetrain !== undefined) {
      fields.push(`drivetrain = $${paramCount++}`);
      values.push(data.drivetrain);
    }
    if (data.exteriorColor !== undefined) {
      fields.push(`exterior_color = $${paramCount++}`);
      values.push(data.exteriorColor);
    }
    if (data.interiorColor !== undefined) {
      fields.push(`interior_color = $${paramCount++}`);
      values.push(data.interiorColor);
    }
    if (data.features !== undefined) {
      fields.push(`features = $${paramCount++}`);
      values.push(JSON.stringify(data.features));
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.dateAcquired !== undefined) {
      fields.push(`date_acquired = $${paramCount++}`);
      values.push(data.dateAcquired);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const result = await query(
      `UPDATE vehicles SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return null;
    return VehicleModel.mapRow(result.rows[0]);
  },

  async delete(id: string): Promise<boolean> {
    const result = await query('DELETE FROM vehicles WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },

  async getStats() {
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

    return result.rows[0];
  },

  mapRow(row: Record<string, unknown>): Vehicle {
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
  },
};
