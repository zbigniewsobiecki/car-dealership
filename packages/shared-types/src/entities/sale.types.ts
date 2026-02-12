import { SaleStatus } from '../enums/sale-status.enum';

export interface Sale {
  id: string;
  vehicleId: string;
  customerId: string;
  salespersonId: string;
  salePrice: number;
  saleDate: Date;
  paymentMethod?: string;
  financingDetails?: Record<string, unknown>;
  tradeInVehicle?: string;
  tradeInValue?: number;
  downPayment?: number;
  status: SaleStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSaleDto {
  vehicleId: string;
  customerId: string;
  salespersonId: string;
  salePrice: number;
  saleDate: Date | string;
  paymentMethod?: string;
  financingDetails?: Record<string, unknown>;
  tradeInVehicle?: string;
  tradeInValue?: number;
  downPayment?: number;
  status: SaleStatus;
  notes?: string;
}

export interface UpdateSaleDto extends Partial<CreateSaleDto> {}
