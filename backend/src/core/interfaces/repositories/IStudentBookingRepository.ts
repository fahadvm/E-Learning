// core/interfaces/repositories/IStudentBookingRepository.ts
import { IBooking } from "../../../models/Booking";

export interface IStudentBookingRepository {
  getAvailability(teacherId: string): Promise<any>;
  createBooking(booking: Partial<IBooking>): Promise<IBooking>;
  updateBookingStatus(bookingId: string, status: string): Promise<IBooking | null>;
  getBookingsByStudent(studentId: string): Promise<IBooking[]>;
  findBookedSlots(teacherId :string , today : Date ,nextWeek : Date): Promise<IBooking[]>
}
