import { RepairStatus } from '../enums/repair-status.enum';

export interface Repair {
  id: string;
  vehicleId: string;
  customerId: string;
  description: string;
  cost: number;
  status: RepairStatus;
  serviceDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRepairDto {
  vehicleId: string;
  customerId: string;
  description: string;
  cost: number;
  status: RepairStatus;
  serviceDate: Date | string;
  notes?: string;
}

export interface UpdateRepairDto extends Partial<CreateRepairDto> {}
