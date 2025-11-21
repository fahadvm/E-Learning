"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, Shield, ArrowLeft, Wallet, Smartphone } from "lucide-react"
import { paymentApi, studentCartApi } from "@/services/APIservices/studentApiservice"
import type { CartData } from "@/types/student/carts"
import { useRouter } from "next/navigation"
import { showErrorToast, showSuccessToast } from "@/utils/Toast"
import { useStudent } from "@/context/studentContext"
import { usePaymentStore } from "@/hooks/usePaymentStore"
import { PaymentStatus } from "@/components/student/checkout/paymentStatus"


export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { student } = useStudent();
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      const data = await studentCartApi.getCart()
      setCartData(data.data)
    } catch (error) {
      console.error("Failed to load cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!cartData || cartData.courses.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Your cart is empty. Go add some courses 🚀</p>
      </div>
    )
  }

  const subtotal = cartData.total
  const discount = 0
  const total = subtotal - discount

  const handleCompletePurchase = () => {
    const { isProcessing, startPayment, endPayment } = usePaymentStore.getState();

    if (isProcessing) {
      showErrorToast("A payment is already being processed. Please wait...");
      return;
    }

    if (paymentMethod !== "upi") {
      showErrorToast("Please select UPI / NetBanking to continue with Razorpay");
      return;
    }

    startPayment();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      try {
        const checking = cartData.courses.map((c) => c._id)
        console.log("sending course ids are :", checking)
        const response = await paymentApi.createOrder({
          amount: total,
          courses: cartData.courses.map((c) => c._id),
        });

        const order = response.data;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: order.amount * 100,
          currency: order.currency,
          name: "DevNext",
          description: "Course Purchase",
          order_id: order.razorpayOrderId,
          handler: async (response: any) => {
            try {
              const verifyResponse = await paymentApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.ok) {
                showSuccessToast("Payment successful!");
                router.push(
                  `/student/checkout/success?orderId=${response.razorpay_order_id}&amount=${order.amount}`
                );
              } else {
                console.error("Verification failed");
              }
            } catch (err) {
              console.error("Verification error:", err);
            } finally {
              endPayment();
            }
          },
          prefill: {
            name: student?.name,
            email: student?.email,
            contact: student?.phone,
          },
          theme: { color: "#176B87" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", () => {
          console.error("Payment failed");
          endPayment();
        });
        rzp.open();
      } catch (err) {
        console.error("Order creation failed:", err);
        endPayment();
      } finally {
        document.body.removeChild(script);
      }
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      endPayment();
      document.body.removeChild(script);
    };
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/student/cart")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
              <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Shield className="h-4 w-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Contact & Payment */}
          <div className="space-y-6">
            {/* Contact Info */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" defaultValue="student@devnext.com" />
                </div>
              </CardContent>
            </Card> */}

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                      <Smartphone className="h-4 w-4" />
                      UPI / NetBanking
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-border rounded-lg">
                    <RadioGroupItem value="wallet" id="wallet" />
                    <Label htmlFor="wallet" className="flex items-center gap-2 cursor-pointer">
                      <Wallet className="h-4 w-4" />
                      Wallet Balance
                    </Label>
                  </div>
                </RadioGroup>


              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Courses */}
                <div className="space-y-4">
                  {cartData.courses.map((course) => (
                    <div key={course._id} className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={course.coverImage || "/placeholder.svg"}
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        {/* <Badge
                          variant="secondary"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                          {course.quantity}
                        </Badge> */}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{course.title}</h4>
                        {/* <p className="text-xs text-muted">By {course.teacherId? course.teacherId: "Unknown"}</p> */}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(course.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Complete Purchase Button */}
                <PaymentStatus />   
                <Button
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                  onClick={handleCompletePurchase}
                  disabled={usePaymentStore.getState().isProcessing}  
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Complete Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
