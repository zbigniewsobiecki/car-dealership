import { DataMapper } from './dataMapper.js';

export interface QueryBuilderOptions {
  tableName: string;
  softDelete?: boolean;
  allowedFilterFields?: string[];
  fieldMap?: Record<string, string>;
}

export interface BuildResult {
  sql: string;
  values: unknown[];
}

export function buildSelectQuery(
  options: QueryBuilderOptions,
  filters: Record<string, unknown>,
  sort: { sortBy: string; sortOrder: 'ASC' | 'DESC' },
  pagination?: { limit: number; offset: number },
  customWhereBuilder?: (key: string, value: unknown, paramCount: number) => { sql: string; value: unknown } | null
): BuildResult {
  const { tableName, softDelete, allowedFilterFields = [], fieldMap = {} } = options;
  const values: unknown[] = [];
  let paramCount = 1;

  let sql = `SELECT *, COUNT(*) OVER() as full_count FROM ${tableName}`;
  const whereClauses: string[] = [];

  if (softDelete) {
    whereClauses.push('deleted_at IS NULL');
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || !allowedFilterFields.includes(key)) {
      continue;
    }

    let clause: { sql: string; value: unknown } | null = null;

    // Try custom builder first
    if (customWhereBuilder) {
      clause = customWhereBuilder(key, value, paramCount);
    }

    // Default equality if no custom clause
    if (!clause) {
      const column = fieldMap[key] || DataMapper.camelToSnake(key);
      clause = {
        sql: `${column} = $${paramCount}`,
        value
      };
    }

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

  if (whereClauses.length > 0) {
    sql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  sql += ` ORDER BY ${sort.sortBy} ${sort.sortOrder}`;

  if (pagination) {
    sql += ` LIMIT $${paramCount++} OFFSET $${paramCount++}`;
    values.push(pagination.limit, pagination.offset);
  }

  return { sql, values };
}