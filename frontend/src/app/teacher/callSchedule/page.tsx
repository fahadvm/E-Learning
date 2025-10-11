"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PhoneCall } from "lucide-react"
import RequestCallList from "@/components/teacher/callSchedule/callRequests"
import AvailabilityScheduler from "@/components/teacher/callSchedule/availability"
import Header from "@/components/teacher/header"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
     <Header />
      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight">
                  Calls & Availability
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage student call requests and set your weekly availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dashboard</CardTitle>
            <CardDescription>Review requests or adjust your availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="requests" className="w-full">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <TabsList className="w-full md:w-auto">
                  <TabsTrigger value="requests" className="w-full md:w-auto">
                    Request Call
                  </TabsTrigger>
                  <TabsTrigger value="availability" className="w-full md:w-auto">
                    Availability
                  </TabsTrigger>
                </TabsList>

                {/* <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Received Requests</span>
                    <Badge variant="secondary" aria-label="Received requests count">
                      12
                    </Badge>
                  </div>
                  <Button variant="outline">View All Requests</Button>
                </div> */}
              </div>

              <TabsContent value="requests" className="mt-6">
                <section aria-labelledby="requests-title" className="space-y-6">
                  <div>
                    <h2 id="requests-title" className="text-xl font-semibold">
                      Request Call
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Here are your call requests sent by students. Schedule your availability so students can book you.
                    </p>
                  </div>
                  <RequestCallList />
                </section>
              </TabsContent>

              <TabsContent value="availability" className="mt-6">
                <section aria-labelledby="availability-title" className="space-y-6">
                  <div>
                    <h2 id="availability-title" className="text-xl font-semibold">
                      Availability Settings
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Configure your break time and weekly schedule so students can book at the right times.
                    </p>
                  </div>
                  <AvailabilityScheduler />
                </section>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
