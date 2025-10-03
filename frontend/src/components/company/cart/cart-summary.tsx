"use client"

import { useState } from "react"
import { Tag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { CartSummary as CartSummaryType } from "@/types/student/carts"

interface CartSummaryProps {
  summary: CartSummaryType
  onClearCart: () => void
  onCheckout: () => void
  isLoading?: boolean
   total:number
}

export function CartSummary({ summary, onClearCart, onCheckout, isLoading ,total }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)
    // Simulate coupon validation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock coupon validation - accept "STUDENT10" for 10% discount
    if (couponCode.toUpperCase() === "STUDENT10") {
      setAppliedCoupon(couponCode)
      setCouponCode("")
    } else {
      // In a real app, show error toast
      console.error("Invalid coupon code")
    }
    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Course Count */}
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {summary.courseCount} {summary.courseCount === 1 ? "Course" : "Courses"}
          </span>
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-2">
         

          {summary.discount > 0 && (
            <div className="flex justify-between text-accent">
              <span>Discount</span>
              <span>-${summary.discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">₹{total.toFixed(2)}</span>
        </div>

        {/* Coupon Section */}
        {/* <div className="space-y-3">
          <Separator />

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-accent/10 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">{appliedCoupon}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveCoupon}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponCode.trim() || isApplyingCoupon}>
                  {isApplyingCoupon ? "Applying..." : "Apply"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Try "STUDENT10" for 10% off</p>
            </div>
          )}
        </div> */}

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onCheckout}
            disabled={isLoading || summary.courseCount === 0}
            className="w-full h-12 text-base font-semibold"
          >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
          </Button>

          <Button
            variant="outline"
            onClick={onClearCart}
            disabled={isLoading || summary.courseCount === 0}
            className="w-full bg-transparent"
          >
            Clear Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
