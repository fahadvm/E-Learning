// store/paymentStore.ts
import { create } from "zustand";

interface PaymentState {
  isProcessing: boolean;
  startPayment: () => void;
  endPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isProcessing: false,
  startPayment: () => set({ isProcessing: true }),
  endPayment: () => set({ isProcessing: false }),
}));
