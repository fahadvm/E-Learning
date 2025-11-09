import { IBooking } from '../../../models/Booking';

export interface ITimeSlotDTO {
  start: string;
  end: string;
}

export interface IBookingDTO {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  slot: ITimeSlotDTO;
  date:string;
  status:'pending' | 'booked' | 'cancelled' | 'rescheduled' | 'failed';
  createdAt?: Date;
  updatedAt?: Date;
}

export const bookingDto = (booking: IBooking ): IBookingDTO => ({
  id: booking._id?.toString() || booking.id,
  studentId: booking.studentId.toString(),
  teacherId: booking.teacherId.toString(),
  courseId: booking.courseId.toString(),
  slot: booking.slot,
  date:booking.date,
  status: booking.status,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

export const bookingsDto = (bookings: IBooking[]): IBookingDTO[] => bookings.map(bookingDto);
