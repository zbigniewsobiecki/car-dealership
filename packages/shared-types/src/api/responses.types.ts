import { User } from '../entities/user.types';

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface RevenueReport {
  totalRevenue: number;
  saleCount: number;
  averageSalePrice: number;
}

export interface MonthlySalesStats {
  month: string; // YYYY-MM format
  salesCount: number;
  revenue: number;
}
