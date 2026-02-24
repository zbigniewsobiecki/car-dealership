import { Payment, CreatePaymentDto, UpdatePaymentDto } from '@car-dealership/shared-types';
import { BaseRepository } from './BaseRepository.js';
import { DataMapper } from '../utils/dataMapper.js';

class PaymentRepository extends BaseRepository<Payment, CreatePaymentDto, UpdatePaymentDto> {
  constructor() {
    super({
      tableName: 'payments',
      defaultSortBy: 'created_at',
      defaultSortOrder: 'DESC',
      allowedSortFields: ['created_at', 'amount', 'status'],
      allowedFilterFields: ['repairId', 'stripePaymentIntentId', 'status'],
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

  /**
   * Find payment by Stripe Payment Intent ID
   */
  async findByStripePaymentIntentId(stripePaymentIntentId: string): Promise<Payment | null> {
    const { data } = await this.findAll({ stripePaymentIntentId });
    return data[0] || null;
  }

  /**
   * Find payments by repair ID
   */
  async findByRepairId(repairId: string): Promise<Payment[]> {
    const { data } = await this.findAll({ repairId });
    return data;
  }
}

export const PaymentModel = new PaymentRepository();
