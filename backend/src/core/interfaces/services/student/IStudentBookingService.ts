import { IBooking } from "../../../../models/Booking";
import { IBookingDTO } from "../../../dtos/student/student.booking.dto";

export interface IStudentBookingService {
  getAvailability(teacherId: string): Promise<IBookingDTO[]>;
  bookSlot(studentId: string, teacherId: string,courseId: string, date: string, day: string, startTime: string, endTime: string, note: string): Promise<IBookingDTO>;
  cancelBooking(bookingId: string): Promise<IBookingDTO>;
  approveBooking(bookingId: string): Promise<IBookingDTO>;
  initiatePayment(bookingId: string, amount: number) : Promise<{ razorpayOrderId: string, booking: IBooking | null }> 
  getHistory(studentId: string): Promise<IBookingDTO[]>;
  getAvailableSlots(teacherId : string ):Promise<any[]>
  getBookingDetails(bookingId: string): Promise<IBooking>
   getScheduledCalls(studentId: string): Promise<IBookingDTO[]>
   verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string):Promise<IBooking  | null>
  
}
