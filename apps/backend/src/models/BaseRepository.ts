import { query } from './db.js';

export interface BaseFilters {
  limit?: number | string;
  page?: number | string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  [key: string]: unknown;
}

export interface RepositoryConfig {
  tableName: string;
  softDelete?: boolean;
  defaultSortBy?: string;
  defaultSortOrder?: 'ASC' | 'DESC';
  allowedSortFields?: string[];
  allowedFilterFields?: string[];
}

export abstract class BaseRepository<T, CreateDto = Record<string, unknown>, UpdateDto = Record<string, unknown>> {
  protected tableName: string;
  protected softDelete: boolean;
  protected defaultSortBy: string;
  protected defaultSortOrder: 'ASC' | 'DESC';
  protected allowedSortFields: string[];
  protected allowedFilterFields: string[];

  constructor(config: RepositoryConfig) {
    this.tableName = config.tableName;
    this.softDelete = config.softDelete ?? false;
    this.defaultSortBy = config.defaultSortBy ?? 'created_at';
    this.defaultSortOrder = config.defaultSortOrder ?? 'DESC';
    this.allowedSortFields = config.allowedSortFields ?? ['created_at'];
    this.allowedFilterFields = config.allowedFilterFields ?? [];
  }

  protected abstract mapRow(row: Record<string, unknown>): T;

  async findAll(filters: BaseFilters = {}): Promise<{ data: T[]; total: number }> {
    const { limit, page, sortBy, sortOrder, ...whereFilters } = filters;
    
    let sql = `SELECT *, COUNT(*) OVER() as full_count FROM ${this.tableName}`;
    const values: unknown[] = [];
    let paramCount = 1;

    const whereClauses: string[] = [];
    if (this.softDelete) {
      whereClauses.push('deleted_at IS NULL');
    }

    for (const [key, value] of Object.entries(whereFilters)) {
      if (value !== undefined && value !== null) {
        // Validate filter key
        if (!this.allowedFilterFields.includes(key)) {
          continue; // Skip disallowed filters
        }

        // Handle specific filter types if needed in subclasses via a hook
        const clause = this.buildWhereClause(key, value, paramCount);
        if (clause) {
          whereClauses.push(clause.sql);
          if (Array.isArray(clause.value)) {
            values.push(...clause.value);
            paramCount += clause.value.length;
          } else {
            values.push(clause.value);
            paramCount++;
          }
        }
      }
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    let finalSortBy = sortBy || this.defaultSortBy;
    if (!this.allowedSortFields.includes(finalSortBy)) {
      finalSortBy = this.defaultSortBy;
    }

    const finalSortOrder = sortOrder || this.defaultSortOrder;
    sql += ` ORDER BY ${finalSortBy} ${finalSortOrder}`;

    if (limit) {
      const limitVal = parseInt(limit.toString());
      const pageVal = page ? parseInt(page.toString()) : 1;
      const offset = (pageVal - 1) * limitVal;

      sql += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
      values.push(limitVal, offset);
    }

    const result = await query(sql, values);
    const total = result.rows.length > 0 ? parseInt(result.rows[0].full_count) : 0;

    return {
      data: result.rows.map(row => this.mapRow(row)),
      total,
    };
  }

  async findById(id: string, options: { withDeleted?: boolean } = {}): Promise<T | null> {
    let sql = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    if (this.softDelete && !options.withDeleted) {
      sql += ' AND deleted_at IS NULL';
    }

    const result = await query(sql, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async create(data: CreateDto | Record<string, unknown>, createdBy?: string): Promise<T> {
    // If data is a DTO, it should be mapped to a database record by the subclass
    // But for the base implementation, we assume it's already a record or compatible
    const record = data as Record<string, unknown>;
    const fields = Object.keys(record);
    const values = Object.values(record);
    
    if (createdBy) {
      fields.push('created_by');
      values.push(createdBy);
    }

    const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await query(sql, values);
    return this.mapRow(result.rows[0]);
  }

  async update(id: string, data: UpdateDto | Record<string, unknown>): Promise<T | null> {
    const record = data as Record<string, unknown>;
    const fields = Object.keys(record);
    if (fields.length === 0) return this.findById(id);

    const values = Object.values(record);
    const setClauses = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    
    let sql = `UPDATE ${this.tableName} SET ${setClauses} WHERE id = $${fields.length + 1}`;
    if (this.softDelete) {
      sql += ' AND deleted_at IS NULL';
    }
    sql += ' RETURNING *';

    const result = await query(sql, [...values, id]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    let sql: string;
    if (this.softDelete) {
      sql = `UPDATE ${this.tableName} SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND deleted_at IS NULL`;
    } else {
      sql = `DELETE FROM ${this.tableName} WHERE id = $1`;
    }

    const result = await query(sql, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  protected buildWhereClause(key: string, value: unknown, paramCount: number): { sql: string; value: unknown } | null {
    // Default implementation: simple equality
    // Subclasses can override for complex filters (LIKE, range, etc.)
    return {
      sql: `${key} = $${paramCount}`,
      value
    };
  }
}