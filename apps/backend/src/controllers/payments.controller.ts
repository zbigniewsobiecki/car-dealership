import { Request, Response } from 'express';
import { paymentsService } from '../services/payments.service.js';
import { BaseController } from './BaseController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../middleware/errorHandler.middleware.js';

class PaymentsController extends BaseController {
  /**
   * Create payment intent for a repair
   */
  createIntent = asyncHandler(async (req: Request, res: Response) => {
    const { repairId } = req.body;

    if (!repairId) {
      throw new AppError(400, 'repairId is required');
    }

    const paymentIntent = await paymentsService.createPaymentIntent(repairId);
    return this.created(res, paymentIntent);
  });

  /**
   * Confirm payment after Stripe confirmation
   */
  confirmPayment = asyncHandler(async (req: Request, res: Response) => {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      throw new AppError(400, 'paymentIntentId is required');
    }

    const payment = await paymentsService.confirmPayment(paymentIntentId);
    return this.ok(res, payment);
  });

  /**
   * Process refund for a payment
   */
  refundPayment = asyncHandler(async (req: Request, res: Response) => {
    const { paymentId } = req.params;
    const { amount } = req.body;

    const payment = await paymentsService.refundPayment(paymentId, amount);
    return this.ok(res, payment);
  });

  /**
   * Handle Stripe webhook events
   */
  handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature) {
      throw new AppError(400, 'Missing stripe-signature header');
    }

    // req.body should be the raw body (not parsed JSON)
    const payload = req.body;

    await paymentsService.handleWebhook(signature, payload);
    return this.ok(res, { received: true });
  });

  /**
   * Get Stripe publishable key
   */
  getPublishableKey = asyncHandler(async (_req: Request, res: Response) => {
    const publishableKey = paymentsService.getPublishableKey();
    return this.ok(res, { publishableKey });
  });

  /**
   * Get payment by ID
   */
  getById = asyncHandler(async (req: Request, res: Response) => {
    const payment = await paymentsService.getById(req.params.id);
    return this.ok(res, payment);
  });

  /**
   * Get all payments (with filters)
   */
  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    const filters = {
      repairId: req.query.repairId as string | undefined,
      status: req.query.status as string | undefined,
      page,
      limit,
    };

    const { data: payments, total } = await paymentsService.getAll(filters);
    return this.paginate(res, payments, page, limit, total);
  });
}

export const paymentsController = new PaymentsController();
