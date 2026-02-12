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
}

export abstract class BaseRepository<T> {
  protected tableName: string;
  protected softDelete: boolean;
  protected defaultSortBy: string;
  protected defaultSortOrder: 'ASC' | 'DESC';

  constructor(config: RepositoryConfig) {
    this.tableName = config.tableName;
    this.softDelete = config.softDelete ?? false;
    this.defaultSortBy = config.defaultSortBy ?? 'created_at';
    this.defaultSortOrder = config.defaultSortOrder ?? 'DESC';
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

    const finalSortBy = sortBy || this.defaultSortBy;
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

  async create(data: Record<string, unknown>, createdBy?: string): Promise<T> {
    const fields = Object.keys(data);
    const values = Object.values(data);
    
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

  async update(id: string, data: Record<string, unknown>): Promise<T | null> {
    const fields = Object.keys(data);
    if (fields.length === 0) return this.findById(id);

    const values = Object.values(data);
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