import { PaymentStatus as PaymentStatusEnum } from '@car-dealership/shared-types';

interface PaymentStatusProps {
  status: PaymentStatusEnum;
}

export const PaymentStatus = ({ status }: PaymentStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case PaymentStatusEnum.SUCCEEDED:
        return 'bg-green-100 text-green-800';
      case PaymentStatusEnum.PENDING:
      case PaymentStatusEnum.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      case PaymentStatusEnum.FAILED:
      case PaymentStatusEnum.CANCELLED:
        return 'bg-red-100 text-red-800';
      case PaymentStatusEnum.REFUNDED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case PaymentStatusEnum.PENDING:
        return 'Pending';
      case PaymentStatusEnum.PROCESSING:
        return 'Processing';
      case PaymentStatusEnum.SUCCEEDED:
        return 'Paid';
      case PaymentStatusEnum.FAILED:
        return 'Failed';
      case PaymentStatusEnum.CANCELLED:
        return 'Cancelled';
      case PaymentStatusEnum.REFUNDED:
        return 'Refunded';
      default:
        return status;
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
      {getStatusLabel()}
    </span>
  );
};
