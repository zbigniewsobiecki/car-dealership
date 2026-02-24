import Stripe from 'stripe';
import { PaymentModel } from '../models/Payment.model.js';
import { RepairModel } from '../models/Repair.model.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import {
  Payment,
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentIntentResponse,
  PaymentStatus
} from '@car-dealership/shared-types';
import { BaseService } from './BaseService.js';
import { stripe, stripeConfig } from '../config/stripe.js';
import { query } from '../models/db.js';

class PaymentsService extends BaseService<Payment, CreatePaymentDto, UpdatePaymentDto> {
  constructor() {
    super(PaymentModel, 'Payment');
  }

  /**
   * Create a Stripe PaymentIntent for a repair
   */
  async createPaymentIntent(repairId: string): Promise<PaymentIntentResponse> {
    // Verify repair exists and get cost
    const repair = await RepairModel.findById(repairId);
    if (!repair) {
      throw new AppError(404, 'Repair not found');
    }

    if (!repair.cost || repair.cost <= 0) {
      throw new AppError(400, 'Repair must have a valid cost to create payment');
    }

    // Check if payment already exists for this repair
    const existingPayments = await PaymentModel.findByRepairId(repairId);
    const hasSuccessfulPayment = existingPayments.some(
      p => p.status === PaymentStatus.SUCCEEDED
    );

    if (hasSuccessfulPayment) {
      throw new AppError(400, 'Payment already completed for this repair');
    }

    // Convert dollars to cents (Stripe uses smallest currency unit)
    const amountInCents = Math.round(repair.cost * 100);

    try {
      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: stripeConfig.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          repairId: repair.id,
          vehicleId: repair.vehicleId,
          customerId: repair.customerId,
        },
      });

      // Save payment record to database
      const payment = await this.create({
        repairId,
        amount: amountInCents,
        currency: stripeConfig.currency,
        paymentMethodTypes: ['card'],
        metadata: {
          stripePaymentIntentId: paymentIntent.id,
          vehicleId: repair.vehicleId,
          customerId: repair.customerId,
        },
      });

      // Update payment with Stripe payment intent ID and client secret
      await PaymentModel.update(payment.id, {
        status: PaymentStatus.PENDING,
      } as UpdatePaymentDto);

      // Store the Stripe payment intent ID
      await query(
        'UPDATE payments SET stripe_payment_intent_id = $1, client_secret = $2 WHERE id = $3',
        [paymentIntent.id, paymentIntent.client_secret, payment.id]
      );

      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: amountInCents,
        currency: stripeConfig.currency,
        status: paymentIntent.status,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new AppError(400, `Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Confirm payment and update repair status
   */
  async confirmPayment(paymentIntentId: string): Promise<Payment> {
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      // Find payment in database
      const payment = await PaymentModel.findByStripePaymentIntentId(paymentIntentId);
      if (!payment) {
        throw new AppError(404, 'Payment not found');
      }

      // Update payment status based on Stripe status
      const paymentStatus = this.mapStripeStatusToPaymentStatus(paymentIntent.status);
      const updatedPayment = await this.update(payment.id, {
        status: paymentStatus,
      });

      // If payment succeeded, update repair payment_id
      if (paymentStatus === PaymentStatus.SUCCEEDED) {
        await query(
          'UPDATE repairs SET payment_id = $1 WHERE id = $2',
          [payment.id, payment.repairId]
        );
      }

      return updatedPayment;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new AppError(400, `Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Process refund for a payment
   */
  async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
    const payment = await this.getById(paymentId);

    if (payment.status !== PaymentStatus.SUCCEEDED) {
      throw new AppError(400, 'Only succeeded payments can be refunded');
    }

    try {
      // Create refund in Stripe
      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents if partial refund
      });

      // Update payment status
      const updatedPayment = await this.update(payment.id, {
        status: PaymentStatus.REFUNDED,
        metadata: {
          ...(payment.metadata || {}),
          refundId: refund.id,
          refundAmount: refund.amount,
          refundedAt: new Date().toISOString(),
        },
      });

      return updatedPayment;
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new AppError(400, `Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(signature: string, payload: string): Promise<void> {
    if (!stripeConfig.webhookSecret) {
      throw new AppError(500, 'Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookSecret
      );
    } catch (error) {
      throw new AppError(400, `Webhook signature verification failed: ${(error as Error).message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.canceled':
        await this.handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await PaymentModel.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.warn(`Payment not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    await this.update(payment.id, {
      status: PaymentStatus.SUCCEEDED,
    });

    // Update repair with payment_id
    await query(
      'UPDATE repairs SET payment_id = $1 WHERE id = $2',
      [payment.id, payment.repairId]
    );
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await PaymentModel.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.warn(`Payment not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    await this.update(payment.id, {
      status: PaymentStatus.FAILED,
      metadata: {
        ...(payment.metadata || {}),
        failureReason: paymentIntent.last_payment_error?.message || 'Unknown error',
      },
    });
  }

  /**
   * Handle canceled payment intent
   */
  private async handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const payment = await PaymentModel.findByStripePaymentIntentId(paymentIntent.id);
    if (!payment) {
      console.warn(`Payment not found for payment intent: ${paymentIntent.id}`);
      return;
    }

    await this.update(payment.id, {
      status: PaymentStatus.CANCELLED,
    });
  }

  /**
   * Map Stripe payment intent status to our PaymentStatus enum
   */
  private mapStripeStatusToPaymentStatus(stripeStatus: string): PaymentStatus {
    switch (stripeStatus) {
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        return PaymentStatus.PENDING;
      case 'processing':
        return PaymentStatus.PROCESSING;
      case 'succeeded':
        return PaymentStatus.SUCCEEDED;
      case 'canceled':
        return PaymentStatus.CANCELLED;
      default:
        return PaymentStatus.FAILED;
    }
  }

  /**
   * Get Stripe publishable key
   */
  getPublishableKey(): string {
    return stripeConfig.publishableKey;
  }
}

export const paymentsService = new PaymentsService();
