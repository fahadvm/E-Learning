"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home, ShoppingCart } from "lucide-react"
import { Suspense } from "react"

function FailureContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get("error") || "Payment failed"
  const sessionId = searchParams.get("session_id") || ""

  const handleRetry = () => {
    // Go back to the checkout page
    router.push("/company/checkout")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f8fafc]">
      <div className="max-w-md w-full p-10 rounded-3xl border border-white bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden text-center animate-in fade-in zoom-in duration-700">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 via-rose-500 to-red-400"></div>
        
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner overflow-hidden relative group">
            <div className="absolute inset-0 bg-red-100/50 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
            <AlertCircle size={48} className="relative transition-transform duration-500 group-hover:rotate-12" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-[#1e293b] mb-3 tracking-tight">Checkout Failed</h1>
        <p className="text-[#64748b] mb-8 leading-relaxed">
          We encountered an issue processing your company's payment. Don't worry, no funds were charged.
        </p>

        <div className="bg-[#fff1f2] rounded-2xl p-6 mb-10 text-left border border-red-50 relative">
          <div className="absolute top-0 right-0 p-3 opacity-10">
               <AlertCircle size={64} />
          </div>
          <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Failure Reason</p>
          <p className="text-sm text-red-900 font-medium leading-relaxed">{error}</p>
          {sessionId && (
            <div className="mt-4 pt-4 border-t border-red-100 flex justify-between items-center">
              <span className="text-[10px] text-red-300 uppercase tracking-tighter">Session ID</span>
              <span className="text-[10px] font-mono text-red-400">{sessionId.slice(0, 16)}...</span>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <Button 
            className="w-full h-14 bg-[#0f172a] hover:bg-black text-white rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-[0.98] font-bold text-base"
            onClick={handleRetry}
          >
            <RefreshCcw className="mr-3 h-5 w-5" />
            Try Again
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
             <Button 
                variant="outline" 
                className="h-14 border-slate-200 bg-white hover:bg-slate-50 rounded-2xl transition-all font-semibold text-slate-600"
                onClick={() => router.push("/company/cart")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Edit Cart
              </Button>
              <Button 
                variant="outline" 
                className="h-14 border-slate-200 bg-white hover:bg-slate-50 rounded-2xl transition-all font-semibold text-slate-600"
                onClick={() => router.push("/company/dashboard")}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
          </div>
        </div>
        
        <p className="mt-10 text-xs text-[#94a3b8] font-medium">
          If you continue to experience issues, please contact our corporate billing team.
        </p>
      </div>
    </div>
  )
}

export default function CompanyPaymentFailurePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-slate-800 animate-spin"></div>
        </div>
      }>
      <FailureContent />
    </Suspense>
  )
}
