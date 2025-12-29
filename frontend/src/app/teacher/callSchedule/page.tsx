"use client"

import { Card, CardContent,  } from "@/components/ui/card"
import { PhoneCall } from "lucide-react"
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
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-primary-foreground">
                <PhoneCall className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-balance text-2xl font-semibold leading-tight tracking-tight">
                  Availability
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage your weekly availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        <Card className="overflow-hidden">
          <CardContent>
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
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
