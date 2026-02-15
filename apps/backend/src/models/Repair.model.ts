import { Repair, CreateRepairDto, UpdateRepairDto } from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';
import { DataMapper } from '../utils/dataMapper.js';

class RepairRepository extends BaseRepository<Repair, CreateRepairDto, UpdateRepairDto> {
  constructor() {
    super({
      tableName: 'repairs',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'start_date', 'end_date', 'cost'],
      allowedFilterFields: ['vehicleId', 'customerId', 'status', 'technician'],
    });
  }

  protected buildWhereClause(key: string, value: unknown, paramCount: number): { sql: string; value: unknown } | null {
    // Convert camelCase filter keys to snake_case column names
    const column = DataMapper.camelToSnake(key);
    return {
      sql: `${column} = $${paramCount}`,
      value
    };
  }
}

export const RepairModel = new RepairRepository();
