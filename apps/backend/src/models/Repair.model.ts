import { Repair, CreateRepairDto, UpdateRepairDto } from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';

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
}

export const RepairModel = new RepairRepository();
