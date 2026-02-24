import { useState, FormEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ModalForm } from '../shared/ModalForm';

interface PaymentFormProps {
  repairId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({ onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/repairs?payment=success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred during payment');
        setIsProcessing(false);
      } else {
        // Payment succeeded
        onSuccess();
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <ModalForm
      title="Payment"
      onCancel={onCancel}
      onSubmit={handleSubmit}
      submitLabel="Pay Now"
      isLoading={isProcessing}
    >
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Enter your payment details below to complete the transaction.
        </div>

        <PaymentElement />

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        <div className="text-xs text-gray-500 mt-4">
          Your payment information is secure and encrypted. We never store your card details.
        </div>
      </div>
    </ModalForm>
  );
};
