import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  currency: 'usd',
  paymentIntentSuccessUrl: process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/repairs',
  paymentIntentCancelUrl: process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/repairs',
};
