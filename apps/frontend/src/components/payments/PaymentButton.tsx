import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from './PaymentForm';
import { usePaymentIntent, useStripeConfig } from '../../hooks/usePayments';
import { Repair, RepairStatus } from '@car-dealership/shared-types';

interface PaymentButtonProps {
  repair: Repair;
  onPaymentSuccess?: () => void;
}

export const PaymentButton = ({ repair, onPaymentSuccess }: PaymentButtonProps) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');

  const { data: stripeConfig } = useStripeConfig();
  const createPaymentIntent = usePaymentIntent();

  const stripePromise = stripeConfig?.publishableKey
    ? loadStripe(stripeConfig.publishableKey)
    : null;

  const canPay = () => {
    // Can only pay for completed repairs that have a cost
    return (
      repair.status === RepairStatus.COMPLETED &&
      repair.cost &&
      repair.cost > 0
    );
  };

  const handlePayClick = async () => {
    if (!canPay()) return;

    try {
      const paymentIntent = await createPaymentIntent.mutateAsync(repair.id);
      setClientSecret(paymentIntent.clientSecret);
      setShowPaymentForm(true);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentForm(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handleCancel = () => {
    setShowPaymentForm(false);
    setClientSecret('');
  };

  if (!canPay()) {
    return null;
  }

  return (
    <>
      <button
        onClick={handlePayClick}
        disabled={createPaymentIntent.isPending}
        className="btn btn-primary"
      >
        {createPaymentIntent.isPending ? 'Loading...' : 'Pay Now'}
      </button>

      {showPaymentForm && clientSecret && stripePromise && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
            },
          }}
        >
          <PaymentForm
            repairId={repair.id}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      )}
    </>
  );
};
