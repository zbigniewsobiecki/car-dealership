import { PaymentStatus } from '../enums/payment-status.enum';

export interface Payment {
  id: string;
  repairId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethodTypes: string[];
  clientSecret?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDto {
  repairId: string;
  amount: number;
  currency?: string;
  paymentMethodTypes?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  metadata?: Record<string, unknown>;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PaymentFilters {
  repairId?: string;
  stripePaymentIntentId?: string;
  status?: PaymentStatus;
}
