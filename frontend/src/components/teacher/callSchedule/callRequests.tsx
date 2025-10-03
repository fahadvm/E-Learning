"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Clock, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

type RequestItem = {
  id: string
  student: string
  topic: string
  date: string // ISO or readable date
  time: string // e.g. "2:30 PM"
  avatar?: string
}

const MOCK_REQUESTS: RequestItem[] = [
  { id: "1", student: "Aisha Khan", topic: "Algebra II - Exam Prep", date: "2025-09-28", time: "10:00 AM" },
  { id: "2", student: "Diego Santos", topic: "Physics - Kinematics", date: "2025-09-28", time: "02:30 PM" },
  { id: "3", student: "Mina Park", topic: "Chemistry - Stoichiometry", date: "2025-09-29", time: "11:15 AM" },
  { id: "4", student: "Leo Williams", topic: "Calculus - Integrals", date: "2025-09-29", time: "04:00 PM" },
  { id: "5", student: "Sara Ahmed", topic: "Biology - Genetics", date: "2025-09-30", time: "09:30 AM" },
]

export default function RequestCallList() {
    const router = useRouter()



  const  handleDetails =  ()=>{
     router.push(`/teacher/callSchedule/request-details`)
  }



  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {MOCK_REQUESTS.map((req) => (
        <Card key={req.id} className="transition-all hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarImage
                  src={req.avatar || "/placeholder.svg?height=96&width=96&query=student%20avatar"}
                  alt={`Avatar of ${req.student}`}
                />
                <AvatarFallback>{req.student.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold leading-tight">{req.student}</h3>
                    <p className="truncate text-sm text-muted-foreground">{req.topic}</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    <time dateTime={req.date}>{new Date(req.date).toLocaleDateString()}</time>
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    {req.time}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm"
                   onClick={() => handleDetails()}
                  >View Details</Button>
                  <Button variant="outline" size="sm" className="inline-flex items-center gap-1 bg-transparent">
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
  )
}
