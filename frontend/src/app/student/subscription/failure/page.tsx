"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home, ArrowLeft } from "lucide-react"
import { Suspense } from "react"

function FailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error") || "Payment failed"
  const orderId = searchParams.get("orderId") || ""
  const code = searchParams.get("code") || ""

  const handleRetry = () => {
    // Go back to the subscription plans page
    router.push("/student/subscription")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-md w-full p-8 rounded-3xl border border-white/20 bg-white/40 dark:bg-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-500"></div>
        
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shadow-inner">
            <AlertCircle size={48} className="animate-pulse" />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">Payment Failed</h1>
        <p className="text-muted-foreground mb-8 text-lg font-medium">
          We couldn't process your subscription payment.
        </p>

        <div className="bg-red-50/50 dark:bg-red-950/20 backdrop-blur-md rounded-2xl p-5 mb-10 text-left border border-red-100 dark:border-red-900/30 shadow-sm">
          <p className="text-xs font-bold text-red-800 dark:text-red-400 mb-2 uppercase tracking-widest">Transaction Status</p>
          <p className="text-base text-red-700 dark:text-red-300 font-medium mb-4">{error}</p>
          
          <div className="space-y-2 border-t border-red-200/30 dark:border-red-800/20 pt-4">
            {orderId && (
              <div className="text-xs text-muted-foreground flex justify-between items-center group">
                <span className="opacity-70">Order ID</span>
                <span className="font-mono bg-white/50 dark:bg-white/5 px-2 py-1 rounded border border-white/20">{orderId.slice(-12)}</span>
              </div>
            )}
            {code && (
              <div className="text-xs text-muted-foreground flex justify-between items-center">
                <span className="opacity-70">Reason Code</span>
                <span className="font-mono text-red-500 dark:text-red-400 font-bold">{code}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button 
            className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-xl shadow-red-500/20 transition-all hover:-translate-y-1 active:scale-95 text-lg font-bold"
            onClick={handleRetry}
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-border/40 bg-white/50 dark:bg-white/5 backdrop-blur-sm transition-all hover:bg-accent hover:border-border text-base font-semibold"
              onClick={() => router.push("/student/subscription")}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Plans
            </Button>
            <Button 
              variant="outline" 
              className="h-14 rounded-2xl border-border/40 bg-white/50 dark:bg-white/5 backdrop-blur-sm transition-all hover:bg-accent hover:border-border text-base font-semibold"
              onClick={() => router.push("/student/home")}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
          </div>
        </div>
        
        <p className="mt-10 text-xs text-muted-foreground font-medium max-w-[280px] mx-auto opacity-70">
          Trouble with payment? Please contact our support team at <span className="text-red-500">support@devnext.com</span>
        </p>
      </div>
    </div>
  )
}

export default function StudentSubscriptionFailurePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
          <div className="w-10 h-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin shadow-lg"></div>
        </div>
      }>
      <FailureContent />
    </Suspense>
  )
}
