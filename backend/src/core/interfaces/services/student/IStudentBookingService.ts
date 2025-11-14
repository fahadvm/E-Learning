import { IBooking } from '../../../../models/Booking';
import { IAvailableSlot } from '../../../../types/filter/fiterTypes';
import { IBookingDTO } from '../../../dtos/student/student.booking.dto';
import { IPaginatedResult } from '../../repositories/IStudentBookingRepository';

export interface IStudentBookingService {
  getAvailability(teacherId: string): Promise<IBookingDTO[]>;
  lockingSlot(
    studentId: string,
    teacherId: string,
    courseId: string,
    date: string,
    day: string,
    startTime: string,
    endTime: string,
    note: string
  ): Promise<IBookingDTO>;
  cancelBooking(bookingId: string, reason: string): Promise<IBookingDTO>;
  approveBooking(bookingId: string): Promise<IBookingDTO>;
  initiatePayment(
    bookingId: string,
    amount: number
  ): Promise<{ razorpayOrderId: string; booking: IBooking | null }>;
  getHistory(
    studentId: string,
    page: number,
    limit: number,
    status?: string,
    teacher?: string
  ): Promise<IPaginatedResult<IBooking>>; 
  getAvailableSlots(teacherId: string): Promise<IAvailableSlot[]>;
  getBookingDetails(bookingId: string): Promise<IBooking>;
  getBookingDetailsByPaymentId(paymentOrderId: string): Promise<IBooking>;
  getScheduledCalls(studentId: string): Promise<IBooking[]>;
  verifyPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
  ): Promise<IBooking | null>;
}

