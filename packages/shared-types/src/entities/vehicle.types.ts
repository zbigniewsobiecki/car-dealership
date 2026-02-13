import { VehicleStatus, VehicleCondition } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';
import { PaginationParams } from '../api/requests.types';

export interface VehicleImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
  order?: number;
}

export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage?: number;
  price: number;
  cost?: number;
  type: VehicleType;
  status: VehicleStatus;
  condition?: VehicleCondition;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  engine?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features?: Record<string, unknown>;
  description?: string;
  images?: VehicleImage[];
  dateAcquired?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface CreateVehicleDto {
  vin: string;
  make: string;
  model: string;
  year: number;
  color: string;
  mileage?: number;
  price: number;
  cost?: number;
  type: VehicleType;
  status: VehicleStatus;
  condition?: VehicleCondition;
  bodyType?: string;
  transmission?: string;
  fuelType?: string;
  engine?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features?: Record<string, unknown>;
  description?: string;
  images?: VehicleImage[];
  dateAcquired?: Date;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

export interface VehicleFilters extends PaginationParams {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  status?: VehicleStatus;
  condition?: VehicleCondition;
  type?: VehicleType;
  search?: string;
}

export interface VehicleStats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  maintenance: number;
  total_inventory_value: number;
}
