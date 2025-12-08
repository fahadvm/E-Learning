"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Lock, Shield, ArrowLeft, Wallet, Smartphone } from "lucide-react"
import type { CartData } from "@/types/company/carts"
import { useRouter } from "next/navigation"
import { showErrorToast } from "@/utils/Toast"
import { usePaymentStore } from "@/hooks/usePaymentStore"
import { PaymentStatus } from "@/components/company/checkout/paymentStatus"
import { companyApiMethods } from "@/services/APIservices/companyApiService"



export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cartData, setCartData] = useState<CartData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setIsLoading(true)
      const data = await companyApiMethods.getCart()
      console.log("data:", data)
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
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    )
  }

  const subtotal = cartData.total
  const discount = 0
  const total = subtotal - discount

  const handleCompletePurchase = async () => {
    const { isProcessing, startPayment, endPayment } = usePaymentStore.getState();

    if (isProcessing) {
      showErrorToast("A payment is already being processed. Please wait...");
      return;
    }

    if (paymentMethod !== "upi") {
      showErrorToast("Please select UPI / NetBanking to continue with Razorpay");
      return;
    }

    try {
      startPayment();
      const response = await companyApiMethods.createCheckoutSession();

      const { url } = response.data;
      console.log("Checkout URL:", url)
      if (url) {
        window.location.href = url;
      } else {
        showErrorToast("Failed to start payment.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      showErrorToast("Something went wrong while processing payment.");
    } finally {
      endPayment();
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/company/cart")}>
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
                  <Input id="email" type="email" placeholder="you@example.com" defaultValue="company@devnext.com" />
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
                          src={course.courseId.coverImage || "/placeholder.svg"}
                          alt={course.courseId.title}
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
                        <h4 className="font-medium text-sm">{course.courseId.title}</h4>
                        {course.seats && (
                          <p className="text-xs text-black">{course.seats} seat{course.seats > 1 ? 's' : ''}</p>
                        )}
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
