import { Router } from 'express';
import { paymentsController } from '../controllers/payments.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import express from 'express';

const router: Router = Router();

// Webhook endpoint - must be before body parser middleware
// Stripe requires raw body for webhook signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentsController.handleWebhook
);

// All other payment routes require authentication
router.use(authenticateToken);

// Get Stripe publishable key
router.get('/config', paymentsController.getPublishableKey);

// Payment operations
router.get('/', paymentsController.getAll);
router.get('/:id', paymentsController.getById);
router.post('/intent', paymentsController.createIntent);
router.post('/confirm', paymentsController.confirmPayment);
router.post('/:paymentId/refund', paymentsController.refundPayment);

export default router;
