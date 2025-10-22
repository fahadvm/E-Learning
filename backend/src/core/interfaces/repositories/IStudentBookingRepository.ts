import { IBooking } from '../../../models/Booking';
import { IBookingFilter } from '../../../types/filter/fiterTypes';

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface IPendingResult {
  requests: IBooking[];
  totalPages: number;
  currentPage: number;
}

export interface IBookingHistoryFilter {
  [key: string]: string | number | Date | Record<string, unknown>;
}

export interface IStudentBookingRepository {
  getAvailability(teacherId: string): Promise<IBooking[]>;
  createBooking(booking: Partial<IBooking>): Promise<IBooking>;
  updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'approved' | 'paid' | 'cancelled' | 'rejected',
    reason?: string
  ): Promise<IBooking | null>;
  getBookingsByStudent(
    studentId: string,
    page: number,
    limit: number,
    status?: string,
    teacher?: string
  ): Promise<IPaginatedResult<IBooking>>;
  findBookedSlots(
    teacherId: string,
    today: string,
    nextWeek: string
  ): Promise<IBooking[]>;
  findPending(page: number, limit: number): Promise<IPendingResult>;
  findConfirmed(): Promise<IBooking[]>;
  findById(id: string): Promise<IBooking | null>;
  rejectBooking(bookingId: string, reason: string): Promise<IBooking | null>;
  findByTeacherDateSlot(
    teacherId: string,
    date: string,
    slot: { start: string; end: string }
  ): Promise<IBooking | null>;
  getScheduledCalls(studentId: string): Promise<IBooking[]>;
  updateBookingOrderId(
    bookingId: string,
    orderId: string
  ): Promise<IBooking | null>;
  findByOrderId(orderId: string): Promise<IBooking | null>;
  verifyAndMarkPaid(orderId: string): Promise<IBooking | null>;
  getHistory(
    filter: IBookingFilter,
    skip: number,
    limit: number
  ): Promise<IBooking[]>;
  countHistory(filter: IBookingFilter): Promise<number>;
}
