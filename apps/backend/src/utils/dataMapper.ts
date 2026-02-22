export interface DataMapperConfig {
  /**
   * Map of camelCase property names to snake_case database column names.
   * If a property is not in this map, it will be converted automatically.
   */
  fieldMap?: Record<string, string>;
}

export class DataMapper {
  public readonly fieldMap: Record<string, string>;
  public readonly reverseFieldMap: Record<string, string>;

  constructor(config: DataMapperConfig = {}) {
    this.fieldMap = config.fieldMap ?? {};
    
    // Create reverse map for row hydration (snake_case -> camelCase)
    this.reverseFieldMap = Object.entries(this.fieldMap).reduce((acc, [camel, snake]) => {
      acc[snake] = camel;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Convert a database row (snake_case) to an entity (camelCase)
   * @param row Database row with snake_case keys
   * @returns Entity with camelCase keys
   */
  mapRow<T>(row: Record<string, unknown>): T {
    const entity: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(row)) {
      if (key === 'full_count') continue;

      // 1. Check reverse map
      let camelKey = this.reverseFieldMap[key];

      // 2. Fallback to automatic conversion if not mapped
      if (!camelKey) {
        camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      }

      // 3. Handle type conversions (Postgres numeric/bigint strings, dates)
      let finalValue = value;
      if (value !== null && value !== undefined) {
        // If it looks like a date string and we expect a Date, or it's already a Date object
        if (value instanceof Date) {
          finalValue = value;
        } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          finalValue = new Date(value);
        }
      }

      entity[camelKey] = finalValue;
    }

    return entity as T;
  }

  /**
   * Convert an entity (camelCase) to a database record (snake_case)
   * @param data Entity with camelCase keys
   * @returns Database record with snake_case keys
   */
  mapToDb(data: Record<string, unknown>): Record<string, unknown> {
    const record: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      
      // 1. Check field map
      let snakeKey = this.fieldMap[key];

      // 2. Fallback to automatic conversion
      if (!snakeKey) {
        snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      }

      // 3. Handle complex types (arrays/objects to JSON)
      let finalValue = value;
      if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        finalValue = JSON.stringify(value);
      }

      record[snakeKey] = finalValue;
    }
    
    return record;
  }

  /**
   * Helper to convert camelCase to snake_case
   */
  static camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  /**
   * Helper to convert snake_case to camelCase
   */
  static snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }
}