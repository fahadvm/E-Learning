import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import SlotsTab from "@/components/teacher/slots/slots-tab"
import UpcomingTab from "@/components/teacher/slots/upcoming-tab"
import Header from "@/components/teacher/header"

type SlotStatus = "booked" | "cancelled" | "requested" | "available"

export type Student = {
    name: string
    email: string
    course: string
}

export type Slot = {
    id: string
    dateKey: string // YYYY-MM-DD
    startISO: string
    endISO: string
    status: SlotStatus
    student?: Student
}

function formatDateKey(date: Date) {
    return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(date)
}

function toISO(d: Date) {
    return d.toISOString()
}

function addMinutes(d: Date, mins: number) {
    const copy = new Date(d)
    copy.setMinutes(copy.getMinutes() + mins)
    return copy
}

function setTime(d: Date, hr: number, min: number) {
    const copy = new Date(d)
    copy.setHours(hr, min, 0, 0)
    return copy
}

// Mock generator: 7 days of 30-min slots from 9:00 → 12:00 and 13:00 → 16:00
function generateWeekSlots(startDate = new Date()): Slot[] {
    const slots: Slot[] = []
    const dayCount = 7

    for (let i = 0; i < dayCount; i++) {
        const day = new Date(startDate)
        day.setDate(startDate.getDate() + i)
        const dateKey = formatDateKey(day)

        const windows = [
            [9, 0, 12, 0], // 9:00 - 12:00
            [13, 0, 16, 0], // 13:00 - 16:00
        ] as const

        for (const [sh, sm, eh, em] of windows) {
            let cur = setTime(day, sh, sm)
            const end = setTime(day, eh, em)

            while (cur < end) {
                const next = addMinutes(cur, 30)
                const id = `${dateKey}-${cur.getHours()}-${cur.getMinutes()}`
                const status = mockStatusByIndex(slots.length)

                const student =
                    status === "booked" || status === "requested" || status === "cancelled"
                        ? mockStudent(slots.length)
                        : undefined

                slots.push({
                    id,
                    dateKey,
                    startISO: toISO(cur),
                    endISO: toISO(next),
                    status,
                    student,
                })

                cur = next
            }
        }
    }

    return slots
}

// Deterministic mock status pattern to showcase UI states
function mockStatusByIndex(i: number): SlotStatus {
    const mod = i % 8
    if (mod === 0) return "booked"
    if (mod === 1) return "requested"
    if (mod === 2) return "cancelled"
    return "available"
}

function mockStudent(i: number): Student {
    const names = ["Alex Johnson", "Priya Patel", "Liam Chen", "Sofia Garcia", "Noah Smith", "Emma Davis"]
    const courses = ["Algebra II", "Physics 101", "Intro to CS", "Literature", "Calculus", "Chemistry"]
    const name = names[i % names.length]
    const course = courses[i % courses.length]
    const email = `${name.toLowerCase().replace(/\\s+/g, ".")}@example.com`
    return { name, email, course }
}

export default function Page() {
    const allSlots = generateWeekSlots(new Date())
    const bookedUpcoming = allSlots.filter((s) => s.status === "booked")

    return (
        <>
            <Header />
            <main className=" mx-auto full-w px-4 py-8">

                <header className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground">Video Meet Slots</h1>
                        <p className="text-muted-foreground">Manage availability and view your upcoming meetings.</p>
                    </div>
                  
                </header>

                <Card>
                    <CardHeader className="flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between">
                        <CardTitle className="text-pretty">Schedule</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <Tabs defaultValue="slots" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="slots">Slots</TabsTrigger>
                                <TabsTrigger value="upcoming">Booked Slots (Upcoming)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="slots" className="mt-6">
                                <SlotsTab slots={allSlots} />
                            </TabsContent>

                            <TabsContent value="upcoming" className="mt-6">
                                <UpcomingTab slots={bookedUpcoming} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

            </main>
        </>
    )
}
