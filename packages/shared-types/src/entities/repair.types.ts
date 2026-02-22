import { RepairStatus } from '../enums/repair-status.enum';

export interface Repair {
  id: string;
  vehicleId: string;
  customerId: string;
  description: string;
  status: RepairStatus;
  cost?: number;
  startDate: Date;
  endDate?: Date;
  technician?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface CreateRepairDto {
  vehicleId: string;
  customerId: string;
  description: string;
  status: RepairStatus;
  cost?: number;
  startDate: Date | string;
  endDate?: Date | string;
  technician?: string;
  notes?: string;
}

export interface UpdateRepairDto extends Partial<CreateRepairDto> {}

export interface RepairFilters {
  vehicleId?: string;
  customerId?: string;
  status?: RepairStatus;
  technician?: string;
}