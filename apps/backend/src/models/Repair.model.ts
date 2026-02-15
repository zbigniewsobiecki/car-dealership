import { query } from './db.js';
import { Repair, CreateRepairDto, UpdateRepairDto } from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';

class RepairRepository extends BaseRepository<Repair, CreateRepairDto, UpdateRepairDto> {
  constructor() {
    super({
      tableName: 'repairs',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'start_date', 'end_date', 'cost'],
      allowedFilterFields: ['vehicle_id', 'customer_id', 'status', 'technician'],
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
}

export const RepairModel = new RepairRepository();
