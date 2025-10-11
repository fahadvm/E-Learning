import { Badge } from "@/components/ui/badge"

type Booking = {
    studentId: { name: string };
    teacherId: { name: string };
    courseId: { title: string };
    date: string
    slot: { start: string, end: string }
    note?:string
}
 
export default function BookingSummary({ booking }: { booking: Booking }) {
    return (
        <div className="space-y-6">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Item label="Student Name" value={booking.studentId?.name} />
                <Item label="Teacher Name" value={booking.teacherId?.name} />
                <Item label="Course Name" value={booking.courseId?.title} />
                <Item label="Date" value={booking.date} />
                <Item label="Time" value={`${booking.slot.start} - ${booking.slot.end}`} />
                <Item label="Fee" value={`₹100`} />
            </dl>

            <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                    Please verify your booking details before proceeding with the payment.
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-md">
                    {booking.note??""}
                </Badge>
                
            </div>


        </div>
    )
}

function Item({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-md border border-transparent bg-card p-3 transition-colors hover:border-border">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value}</dd>
        </div>
    )
}
