import { IBooking } from "../../../../models/Booking";

export interface ITeacherCallRequestService {
    getPendingRequests(): Promise<IBooking[]>
    getConfirmedRequests(): Promise<IBooking[]>
    getRequestDetails(bookingId: string): Promise<IBooking | null>
    approveRequest(bookingId: string): Promise<IBooking | null>
    rejectRequest(bookingId: string, reason: string): Promise<IBooking | null>
    getTeacherSlots(teacherId: string) : Promise<any[] | null>
}
