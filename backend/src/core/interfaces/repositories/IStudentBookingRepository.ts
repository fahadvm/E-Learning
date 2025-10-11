// core/interfaces/repositories/IStudentBookingRepository.ts
import { IBooking } from "../../../models/Booking";

export interface IStudentBookingRepository {
  getAvailability(teacherId: string): Promise<any>;
  createBooking(booking: Partial<IBooking>): Promise<IBooking>;
  updateBookingStatus(bookingId: string, status: string): Promise<IBooking | null>;
  getBookingsByStudent(studentId: string): Promise<IBooking[]>;
  findBookedSlots(teacherId: string, today: string, nextWeek: string): Promise<IBooking[]>
  findPending(): Promise<IBooking[]>
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

}
