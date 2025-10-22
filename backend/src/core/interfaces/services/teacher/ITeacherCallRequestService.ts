import { IBooking } from '../../../../models/Booking';
import { ITeacherSlot } from '../../../../types/filter/fiterTypes';
import { IBookingDTO } from '../../../dtos/student/student.booking.dto';
import { IPaginationResponse } from '../../../dtos/teacher/TeacherDTO';

export interface ITeacherCallRequestService {
  getPendingRequests(page: number, limit: number): Promise<{
    requests: IBooking[]
    totalPages: number
    currentPage: number
  }>
  getConfirmedRequests(): Promise<IBooking[]>
  getRequestDetails(bookingId: string): Promise<IBooking | null>
  approveRequest(bookingId: string): Promise<IBooking | null>
  rejectRequest(bookingId: string, reason: string): Promise<IBooking | null>
  getTeacherSlots(teacherId: string): Promise<ITeacherSlot[] | null>
  cancelBooking(bookingId: string, reason: string): Promise<IBookingDTO>;
  getHistory(teacherId: string, page: number, limit: number, status?: string): Promise<IPaginationResponse<IBooking>>
}
