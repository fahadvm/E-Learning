"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight, FileText, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SubscriptionSuccess() {
  const searchParams = useSearchParams()

  const planName = searchParams.get("planName") || "DevNext Premium Plan"
  const price = searchParams.get("price") || "29.00"
  const orderId = searchParams.get("orderId") || "SUB-00000"
  const type = searchParams.get("type") || "Monthly • Auto-renew enabled"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Activated!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for subscribing. You now have full access to all premium courses and features.
          </p>
        </div>

        {/* Subscription Summary Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Subscription Details</h2>
              <span className="text-sm text-gray-500">Order #{orderId}</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{planName}</h3>
                    <p className="text-sm text-gray-500">{type}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">₹{price}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total Paid</span>
              <span className="text-2xl font-bold text-blue-600">₹{price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/student/home" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="flex-1 py-3 text-lg font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
            onClick={() => alert("Download Invoice coming soon!")}
          >
            Download Invoice
            <FileText className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">A confirmation email has been sent to your registered email.</p>
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <Link href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
