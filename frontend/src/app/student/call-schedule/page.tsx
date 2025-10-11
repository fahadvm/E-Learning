"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingRequestsHistory } from "@/components/student/call-schedule/booking-requests-history"
import { ScheduledCalls } from "@/components/student/call-schedule/scheduled-calls"
import { Calendar, History } from "lucide-react"
import Header from "@/components/student/header"

export default function BookingManagementPage() {
  const [activeTab, setActiveTab] = useState("history")

  return (
    <div className="min-h-screen bg-background">
        <Header />
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">Video Call Bookings</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your booking requests and scheduled calls</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Booking Requests
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled Calls
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0">
            <BookingRequestsHistory />
          </TabsContent>

          <TabsContent value="scheduled" className="mt-0">
            <ScheduledCalls />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
