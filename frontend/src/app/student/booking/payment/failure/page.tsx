"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import { Suspense } from "react"

function FailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error") || "Payment failed"
  const orderId = searchParams.get("orderId") || ""
  const code = searchParams.get("code") || ""

  const handleRetry = () => {
    // Go back to the payment page
    router.back()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
        
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 animate-bounce">
            <AlertCircle size={40} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          Unfortunately, your payment could not be processed completely.
        </p>

        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 mb-8 text-left border border-red-100 dark:border-red-900/20">
          <p className="text-sm font-semibold text-red-800 dark:text-red-400 mb-1">Error Details:</p>
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">{error}</p>
          {orderId && (
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono">{orderId.slice(-8)}...</span>
            </div>
          )}
          {code && (
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>Error Code:</span>
              <span className="font-mono">{code}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Button 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
            onClick={handleRetry}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry Payment
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full h-12 border-border/50 bg-background/50 backdrop-blur-sm transition-all hover:bg-accent"
            onClick={() => router.push("/student/home")}
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </div>
        
        <p className="mt-8 text-xs text-muted-foreground">
          If money was deducted from your account, it will be refunded within 5-7 business days.
        </p>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        </div>
      }>
      <FailureContent />
    </Suspense>
  )
}
