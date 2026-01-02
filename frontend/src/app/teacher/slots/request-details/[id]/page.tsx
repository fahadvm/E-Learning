"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { teacherCallRequestApi } from "@/services/APIservices/teacherApiService"
import { showSuccessToast } from "@/utils/Toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, BookOpen, User, FileText, CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { convertTo12Hour, formatDateToDDMMYYYY } from "@/utils/timeConverter"
import { useLoading } from "@/hooks/useLoading"
import Loader from "@/components/common/Loader"


interface CallRequest {
  _id: string;
  studentId: { name: string };
  courseId: { title: string };
  slot: { start: string; end: string };
  date: string;
  status: string;
  note?: string;
}

export default function TeacherRequestDetails() {
  const router = useRouter()
  const params = useParams()
  const requestId = params?.id as string

  const [requestData, setRequestData] = useState<CallRequest | null>(null)
  const { isLoading } = useLoading();
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!requestId) return

    const fetchRequest = async () => {
      try {
        const res = await teacherCallRequestApi.getRequestDetails(requestId)
        console.log("comming response is:= ", res)
        setRequestData(res.data)
      } catch (err: unknown) {
        console.error(err)
        setError("Failed to fetch request data.")
      }
    }

    fetchRequest()
  }, [requestId])

  const handleApprove = async () => {
    if (!requestData) return
    setIsSubmitting(true)
    setError(null)
    try {
      await teacherCallRequestApi.approveRequests(requestData._id)
      showSuccessToast("Request approved successfully")
      router.push("/teacher/callSchedule")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to approve the request.")
      } else {
        setError("Failed to approve the request.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (isRejecting && !rejectionReason.trim()) {
      setError("Please provide a reason for rejection.")
      return
    }
    if (!requestData) return;

    setIsSubmitting(true)
    setError(null)

    try {
      await teacherCallRequestApi.rejectRequests(requestData._id, {
        status: "reject",
        reason: rejectionReason,
      })
      showSuccessToast("Request rejected successfully")
      router.push("/teacher/callSchedule")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to reject the request.")
      } else {
        setError("Failed to reject the request.")
      }
    }
    finally {
      setIsSubmitting(false)
      setIsRejecting(false)
      setRejectionReason("")
    }
  }

  const toggleReject = () => {
    setIsRejecting(!isRejecting)
    setError(null)
    setRejectionReason("")
  }



  if (!requestData) {
    return (

      <div className="min-h-screen flex items-center justify-center bg-background">
        {isLoading && <Loader loadingTexts="Loading request details..." />}
        <Card className="p-8 max-w-md text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <p className="text-foreground text-lg font-medium">Request not found</p>
          <p className="text-muted-foreground mt-2">
            The request you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push("/teacher/callSchedule")} className="mt-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedule
          </Button>
        </Card>
      </div>
    )
  }

  const student = requestData.studentId
  const course = requestData.courseId
  const slot = requestData.slot

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
      case "approved":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
      case "rejected":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/teacher/callSchedule")} className="mb-4 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Schedule
          </Button>
          <h1 className="text-4xl font-bold text-foreground text-balance">Call Request Details</h1>
          <p className="text-muted-foreground mt-2 text-lg">Review and respond to this student's call request</p>
        </div>

        {/* Main Card */}
        <Card className="p-6 sm:p-8 shadow-lg">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Request Status</p>
              <Badge
                variant="outline"
                className={`${getStatusColor(requestData.status)} text-base px-4 py-1.5 font-medium capitalize`}
              >
                {requestData.status}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Request ID</p>
              <p className="text-sm font-mono text-foreground mt-1">{requestData._id.slice(-8)}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid gap-6 mb-8">
            {/* Student Info */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Student Name</p>
                <p className="text-lg font-semibold text-foreground">{student?.name}</p>
              </div>
            </div>

            {/* Course Info */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Course Name</p>
                <p className="text-lg font-semibold text-foreground">{course?.title}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                  <p className="text-lg font-semibold text-foreground">{formatDateToDDMMYYYY(requestData.date)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Time Slot</p>
                  <p className="text-lg font-semibold text-foreground">{`${convertTo12Hour(slot.start)} - ${convertTo12Hour(slot.end)}`}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-muted-foreground mb-1">Student Notes</p>
                <p className="text-base text-foreground leading-relaxed">
                  {requestData.note || "No additional notes provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Rejection Textarea */}
          {isRejecting && (
            <div className="mb-6 p-6 rounded-lg bg-muted/50 border border-border">
              <label htmlFor="rejectionReason" className="text-sm font-semibold text-foreground mb-3 block">
                Reason for Rejection *
              </label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[120px] resize-none"
                placeholder="Please provide a clear reason for rejecting this request. This will be shared with the student."
              />
              <p className="text-xs text-muted-foreground mt-2">
                A detailed explanation helps students understand and plan accordingly.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-border">
            {isRejecting ? (
              <>
                <Button
                  onClick={toggleReject}
                  variant="outline"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Confirm Rejection"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={toggleReject}
                  variant="outline"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Request
                </Button>
                <Button
                  onClick={handleApprove}
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Approving..." : "Approve Request"}
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
