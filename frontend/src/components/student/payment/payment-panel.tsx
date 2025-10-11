"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { usePaymentStore } from "@/hooks/usePaymentStore"
import { paymentApi } from "@/services/APImethods/studentAPImethods"
import { showErrorToast, showSuccessToast } from "@/utils/Toast"

type MethodIcon = "card" | "upi" | "wallet" | "bank"
type PaymentMethod = { id: string; name: string; icon: MethodIcon }

interface PaymentPanelProps {
  paymentMethods: PaymentMethod[]
  fee: number
  note?: string
  student: { name: string; email: string; phone: string }
  bookingId: string
}

export default function PaymentPanel({
  paymentMethods,
  fee,
  note,
  student,
  bookingId,
}: PaymentPanelProps) {
  const router = useRouter()
  const [selected, setSelected] = React.useState(paymentMethods[0]?.id ?? "")

  const handleCompletePurchase = () => {
  const { isProcessing, startPayment, endPayment } = usePaymentStore.getState();

  if (isProcessing) {
    showErrorToast("A payment is already being processed. Please wait...");
    return;
  }

  if (selected !== "upi" && selected !== "net-banking") {
    showErrorToast("Please select UPI / NetBanking to continue with Razorpay");
    return;
  }

  startPayment();

  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.async = true;
  document.body.appendChild(script);

  const safeRemoveScript = () => {
    try {
      if (document.body.contains(script)) document.body.removeChild(script);
    } catch (e) {
      console.warn("Could not remove razorpay script", e);
    }
  };

  script.onload = async () => {
    try {
      // Create order on backend (returns the booking with paymentOrderId)
      const response = await paymentApi.bookingPayment({
        amount: fee,
        bookingId,
      });

      const orderResp = response.data;

      // order id on booking is paymentOrderId per your repo/schema
      const razorpayOrderId =
        orderResp?.paymentOrderId ?? orderResp?.razorpayOrderId ?? null;

      if (!razorpayOrderId) {
        console.error("No order id returned from backend:", orderResp);
        showErrorToast("Order creation failed (no order id)");
        endPayment();
        safeRemoveScript();
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: fee * 100, // ensure amount matches what's created on server (in paise)
        currency: "INR",
        name: "DevNext",
        description: "Booking Payment",
        order_id: razorpayOrderId, // <-- use backend's paymentOrderId
        handler: async (response: any) => {
          try {
            // verify on backend
            const verifyResponse = await paymentApi.verifyBookingPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // adjust based on your API client's shape
            if (verifyResponse?.ok || verifyResponse?.data) {
              showSuccessToast("Payment successful!");
              router.push(
                `/student/booking/payment/success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}&amount=${fee}`
              );
            } else {
              console.error("Verification failed", verifyResponse);
              showErrorToast("Payment verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showErrorToast("Payment verification error");
          } finally {
            endPayment();
          }
        },
        prefill: {
          name: student?.name ?? "Student",
          email: student?.email ?? "no-reply@example.com",
          contact: `${student?.phone ?? ""}`,
        },
        theme: { color: "#176B87" },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on("payment.failed", (err: any) => {
        console.error("Payment failed:", err);
        showErrorToast("Payment failed");
        endPayment();
      });

      rzp.open();
    } catch (err) {
      console.error("Order creation failed:", err);
      showErrorToast("Order creation failed");
      endPayment();
    } finally {
      // safely remove script after open attempt; don't rely on exact timing
      setTimeout(safeRemoveScript, 5000);
    }
  };

  script.onerror = () => {
    console.error("Failed to load Razorpay SDK");
    showErrorToast("Payment SDK failed to load");
    endPayment();
    safeRemoveScript();
  };
};


  return (
    <div className="space-y-6">
      <SecureBadge />

      <fieldset className="space-y-3">
        <legend className="sr-only">{"Select Payment Method"}</legend>

        <div role="radiogroup" aria-label="Payment methods" className="grid grid-cols-2 gap-3">
          {paymentMethods.map((m) => (
            <label
              key={m.id}
              htmlFor={`method-${m.id}`}
              className="group relative flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring/50"
            >
              <input
                id={`method-${m.id}`}
                type="radio"
                name="payment-method"
                value={m.id}
                checked={selected === m.id}
                onChange={() => setSelected(m.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground"
              >
                <Icon name={m.icon} />
              </span>
              <span className="text-sm font-medium">{m.name}</span>
              <span
                className="pointer-events-none absolute inset-0 rounded-lg ring-2 ring-transparent peer-checked:ring-primary"
                aria-hidden="true"
              />
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">{`₹${fee}`}</span>
        </div>
        {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
      </div>

      <Button onClick={handleCompletePurchase} className="w-full">
        {`Pay Now ₹${fee}`}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
    </div>
  )
}


function readableName(id: string, methods: PaymentMethod[]) {
  return methods.find((m) => m.id === id)?.name ?? "selected method"
}

function SecureBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
      <span className="inline-flex h-4 w-4 items-center justify-center">
        <LockIcon />
      </span>
      <span>{"secured"}</span>
    </div>
  )
}

function Icon({ name }: { name: MethodIcon }) {
  switch (name) {
    case "card":
      return <CardIcon />
    case "upi":
      return <UpiIcon />
    case "wallet":
      return <WalletIcon />
    case "bank":
      return <BankIcon />
    default:
      return null
  }
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
      <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9zm3 4a2 2 0 110 4 2 2 0 010-4z" />
    </svg>
  )
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
      <path d="M2 5a2 2 0 012-2h16a2 2 0 012 2v2H2V5zm0 6h20v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8zm3 5h6v2H5v-2z" />
    </svg>
  )
}

function UpiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
      <path d="M3 12l3-7h12l-3 7 3 7H6l3-7-3-7H3z" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
      <path d="M2 7a3 3 0 013-3h13a2 2 0 012 2v3h-5a3 3 0 000 6h5v3a2 2 0 01-2 2H5a3 3 0 01-3-3V7zm15 5a1 1 0 110 2 1 1 0 010-2z" />
    </svg>
  )
}

function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="fill-current">
      <path d="M12 2L2 7v2h20V7L12 2zM4 11v7H2v2h20v-2h-2v-7H4zm2 0h3v7H6v-7zm5 0h2v7h-2v-7zm5 0h3v7h-3v-7z" />
    </svg>
  )
}
