import { query } from './db.js';
import { buildSelectQuery } from '../utils/queryBuilder.js';
import { DataMapper } from '../utils/dataMapper.js';

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
  /**
   * Map of camelCase property names to snake_case database column names.
   * If a property is not in this map, it will be converted automatically.
   */
  fieldMap?: Record<string, string>;
}

export abstract class BaseRepository<T, CreateDto = Record<string, unknown>, UpdateDto = Record<string, unknown>> {
  protected tableName: string;
  protected softDelete: boolean;
  protected defaultSortBy: string;
  protected defaultSortOrder: 'ASC' | 'DESC';
  protected allowedSortFields: string[];
  protected allowedFilterFields: string[];
  protected dataMapper: DataMapper;

  constructor(config: RepositoryConfig) {
    this.tableName = config.tableName;
    this.softDelete = config.softDelete ?? false;
    this.defaultSortBy = config.defaultSortBy ?? 'created_at';
    this.defaultSortOrder = config.defaultSortOrder ?? 'DESC';
    this.allowedSortFields = config.allowedSortFields ?? ['created_at'];
    this.allowedFilterFields = config.allowedFilterFields ?? [];
    this.dataMapper = new DataMapper({ fieldMap: config.fieldMap });
  }

  async findAll(filters: BaseFilters = {}): Promise<{ data: T[]; total: number }> {
    const { limit, page, sortBy, sortOrder, ...whereFilters } = filters;
    
    const finalSortBy = sortBy && this.allowedSortFields.includes(sortBy) 
      ? sortBy 
      : this.defaultSortBy;
    const finalSortOrder = sortOrder || this.defaultSortOrder;

    const pagination = limit ? {
      limit: parseInt(limit.toString()),
      offset: (page ? parseInt(page.toString()) - 1 : 0) * parseInt(limit.toString())
    } : undefined;

    const { sql, values } = buildSelectQuery(
      {
        tableName: this.tableName,
        softDelete: this.softDelete,
        allowedFilterFields: this.allowedFilterFields,
        fieldMap: this.dataMapper.fieldMap
      },
      whereFilters as Record<string, unknown>,
      { sortBy: finalSortBy, sortOrder: finalSortOrder },
      pagination,
      this.buildWhereClause.bind(this)
    );

    const result = await query(sql, values);
    const total = result.rows.length > 0 ? parseInt(result.rows[0].full_count) : 0;

    return {
      data: result.rows.map(row => this.dataMapper.mapRow<T>(row)),
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
    return this.dataMapper.mapRow<T>(result.rows[0]);
  }

  async create(data: CreateDto | Record<string, unknown>, createdBy?: string): Promise<T> {
    const record = this.dataMapper.mapToDb(data as Record<string, unknown>);
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
    return this.dataMapper.mapRow<T>(result.rows[0]);
  }

  async update(id: string, data: UpdateDto | Record<string, unknown>): Promise<T | null> {
    const record = this.dataMapper.mapToDb(data as Record<string, unknown>);
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
    return this.dataMapper.mapRow<T>(result.rows[0]);
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