
export interface IBookingDTO {
  id: string;
  studentId: string;
  teacherId: string;
  courseId: string;
  slot: Date;
  status: "pending" | "approved" | "cancelled" | "paid";
  createdAt?: Date;
  updatedAt?: Date;
}

export const bookingDto = (booking: any): IBookingDTO => ({
  id: booking._id?.toString() || booking.id,
  studentId: booking.studentId,
  teacherId: booking.teacherId,
  courseId: booking.courseId,
  slot: booking.slot,
  status: booking.status,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
});

export const bookingsDto = (bookings: any[]): IBookingDTO[] => bookings.map(bookingDto);
