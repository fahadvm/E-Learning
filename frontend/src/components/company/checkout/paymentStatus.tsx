import { usePaymentStore } from "@/hooks/usePaymentStore";

export const PaymentStatus = () => {
  const isProcessing = usePaymentStore((s) => s.isProcessing);
  return isProcessing ? (
    <p className="text-yellow-600">Processing your payment, please wait...</p>
  ) : null;
};
