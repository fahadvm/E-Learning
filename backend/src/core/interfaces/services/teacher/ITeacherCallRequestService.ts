import { IBooking } from "../../../../models/Booking";
import { IPaginationResponse } from "../../../dtos/teacher/TeacherDTO";

export interface ITeacherCallRequestService {
    getPendingRequests(page : number, limit: number): Promise<{
    requests: IBooking[]
    totalPages: number
    currentPage: number
  }>
    getConfirmedRequests(): Promise<IBooking[]>
    getRequestDetails(bookingId: string): Promise<IBooking | null>
    approveRequest(bookingId: string): Promise<IBooking | null>
    rejectRequest(bookingId: string, reason: string): Promise<IBooking | null>
    getTeacherSlots(teacherId: string) : Promise<any[] | null>
    // cancelRequest(bookingId: string,reason: string,teacherId: string ) : Promise<IBooking >
    getHistory(teacherId: string, page: number, limit: number, status?: string) : Promise<IPaginationResponse<IBooking>>
}
