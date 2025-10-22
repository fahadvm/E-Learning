"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { teacherCallRequestApi } from "@/services/APImethods/teacherAPImethods"
import { convertTo12Hour } from "@/utils/timeConverter"

type RequestItem = {
  _id: string
  studentId: {
    _id : string
    name: string
    profilePicture?: string
  }
  courseId: {
    title: string
  }
  date: string
  slot: {
    start: string
    end: string
  }
  note?: string
  status: string
}

export default function RequestCallList() {
  const router = useRouter()

  const [requests, setRequests] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 10

  useEffect(() => {
    fetchRequests(currentPage)
  }, [currentPage])

  const fetchRequests = async (page: number) => {
    try {
      setLoading(true)
      const { data } = await teacherCallRequestApi.getPendingRequests({page, limit})

      // Expected response shape from backend:
      // { requests: RequestItem[], totalPages: number, currentPage: number }
      setRequests(data.requests || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      console.error("Error fetching requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDetails = (id: string) => {
    router.push(`/teacher/slots/request-details/${id}`)
  }
  const handleChat = (studentId: string) => {
    router.push(`/teacher/chat/${studentId}`)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  if (loading) return <p>Loading...</p>
  if (!requests.length) return <p>No pending requests found.</p>

  return (
    <div className="space-y-6">
      {/* Request List */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {requests.map((req) => (
          <Card key={req._id} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage
                    src={
                      req.studentId.profilePicture ||
                      "/placeholder.svg?height=96&width=96&query=student%20avatar"
                    }
                    alt={`Avatar of ${req.studentId.name}`}
                  />
                  <AvatarFallback>
                    {req.studentId.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold leading-tight">
                        {req.studentId.name}
                      </h3>
                      <p className="truncate text-sm text-muted-foreground">
                        {req.courseId.title}
                      </p>
                    </div>
                    <Badge variant="secondary">{req.status.toUpperCase()}</Badge>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      <time dateTime={req.date}>
                        {new Date(req.date).toLocaleDateString()}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {convertTo12Hour(req.slot.start)} - {convertTo12Hour(req.slot.end)}
                    </span>
                  </div>

                  {req.note && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Note: {req.note}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => handleDetails(req._id)}>
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm" onClick={() => handleChat(req.studentId._id)}
                      className="inline-flex items-center gap-1 bg-transparent"
                    >
                      <MessageSquare className="h-4 w-4" aria-hidden="true" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
