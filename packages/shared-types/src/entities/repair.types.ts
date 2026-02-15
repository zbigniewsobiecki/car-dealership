import { RepairStatus } from '../enums/repair-status.enum';
import { PaginationParams } from '../api/requests.types';

export interface Repair {
  id: string;
  vehicleId: string;
  customerId: string;
  description: string;
  status: RepairStatus;
  estimatedCost?: number;
  actualCost?: number;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface CreateRepairDto {
  vehicleId: string;
  customerId: string;
  description: string;
  status?: RepairStatus;
  estimatedCost?: number;
  actualCost?: number;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  notes?: string;
}

export interface UpdateRepairDto extends Partial<CreateRepairDto> {
  status?: RepairStatus;
}

export interface RepairFilters extends PaginationParams {
  vehicleId?: string;
  customerId?: string;
  status?: RepairStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface RepairStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  total_estimated_cost: number;
  total_actual_cost: number;
}
