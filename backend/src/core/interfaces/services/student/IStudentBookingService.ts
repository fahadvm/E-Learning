import { IBookingDTO } from "../../../dtos/student/student.booking.dto";

export interface IStudentBookingService {
  getAvailability(teacherId: string): Promise<IBookingDTO[]>;
  bookSlot(studentId: string, teacherId: string,courseId: string, date: string, day: string, startTime: string, endTime: string, note: string): Promise<IBookingDTO>;
  cancelBooking(bookingId: string): Promise<IBookingDTO>;
  approveBooking(bookingId: string): Promise<IBookingDTO>;
  payBooking(bookingId: string, paymentDetails: any): Promise<IBookingDTO>;
  getHistory(studentId: string): Promise<IBookingDTO[]>;
  getAvailableSlots(teacherId : string ):Promise<any[]>
}
