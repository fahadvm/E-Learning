// core/interfaces/repositories/IStudentBookingRepository.ts
import { IBooking } from "../../../models/Booking";

export interface IStudentBookingRepository {
  getAvailability(teacherId: string): Promise<any>;
  createBooking(booking: Partial<IBooking>): Promise<IBooking>;
  updateBookingStatus(bookingId: string, status: string ,reason? : string): Promise<IBooking | null>;
  getBookingsByStudent(studentId: string , page: number, limit: number, status?: string, teacher?: string): Promise<IBooking[]>;
  findBookedSlots(teacherId: string, today: string, nextWeek: string): Promise<IBooking[]>
  findPending(page: number, limit: number): Promise<any>
  findConfirmed(): Promise<IBooking[]>
  findById(id: string): Promise<IBooking | null>
  rejectBooking(bookingId: string, reason: string): Promise<IBooking | null>
  findByTeacherDateSlot(
    teacherId: string,
    date: string,
    slot: { start: string; end: string }
  ): Promise<IBooking | null>
  getScheduledCalls(studentId: string): Promise<IBooking[]>
  updateBookingOrderId(bookingId: string, orderId: string): Promise<IBooking | null>
  findByOrderId(orderId: string): Promise<IBooking | null>
  verifyAndMarkPaid(orderId: string): Promise<IBooking | null>
  getHistory(filter: any, skip: number, limit: number): Promise<IBooking[]>
  countHistory(filter: any): Promise<number>

}
