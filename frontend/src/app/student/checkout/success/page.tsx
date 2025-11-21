"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight, Download, Calendar, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { paymentApi } from "@/services/APIservices/studentApiservice"
import { formatMinutesToHours } from "@/utils/timeConverter"

export default function PurchaseSuccess() {
  const params = useSearchParams()
  const orderId = params.get("orderId")

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        const res = await paymentApi.getOrderDetails(orderId)
        console.log("response is",res.data)
        setOrder(res.data)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium">
        Loading...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">
        Failed to load order details.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">

        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Your purchased courses are now available in your account.</p>
        </div>

        {/* Order Summary Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
              <span className="text-sm text-gray-500">Order #{order.orderId}</span>
            </div>

            <div className="flex items-center text-gray-600 gap-2 mb-4">
              <Calendar className="w-4 h-4" />
              <span>Purchased on: {new Date(order.updatedAt).toLocaleString()}</span>
            </div>

            <p className="text-gray-600 mb-4">
              <span className="font-medium">Payment Method:</span> {order.payment_method}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-lg font-semibold text-gray-900">Total Paid</span>
              <span className="text-2xl font-bold text-blue-600">₹{order.amount}</span>
            </div>

          </CardContent>
        </Card>

        {/* Purchased Courses */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Purchased Courses</h2>

            <div className="space-y-6">
              {order.courses.map((course: any) => (
                <div
                  key={course._id}
                  className="flex gap-4 bg-white p-4 rounded-lg border border-gray-200 hover:shadow"
                >
                  <img
                    src={course.coverImage}
                    alt={course.title}
                    className="w-28 h-20 rounded object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {course.teacherId.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatMinutesToHours(course.totalDuration)}
                      </div>
                    </div>

                    <Link href={`/student/course/${course.id}`}>
                      <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                        Start Learning
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/student/mycourses" className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
              Go to My Courses
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="flex-1 py-3 text-lg font-medium border-gray-300 hover:bg-gray-50 bg-transparent"
          >
            Download Receipt
            <Download className="ml-2 w-5 h-5" />
          </Button>
        </div>

      </div>
    </div>
  )
}
