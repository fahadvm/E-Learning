// src/services/student/student.booking.service.ts
import { injectable, inject } from 'inversify';
import { IStudentBookingService } from '../../core/interfaces/services/student/IStudentBookingService';
import { IPaginatedResult, IStudentBookingRepository } from '../../core/interfaces/repositories/IStudentBookingRepository';
import { TYPES } from '../../core/di/types';
import { IBookingDTO, bookingDto, bookingsDto } from '../../core/dtos/student/student.booking.dto';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { Types } from 'mongoose';
import dayjs from 'dayjs';
import { ITeacherAvailabilityRepository } from '../../core/interfaces/repositories/ITeacherAvailabilityRepository';
import { IBooking } from '../../models/Booking';
import Razorpay from 'razorpay';
import { INotificationRepository } from '../../core/interfaces/repositories/INotificationRepository';
import { IAvailableSlot } from '../../types/filter/fiterTypes';


@injectable()
export class StudentBookingService implements IStudentBookingService {
  private _razorpay: Razorpay;
  constructor(
    @inject(TYPES.StudentBookingRepository) private readonly _bookingRepo: IStudentBookingRepository,
    @inject(TYPES.TeacherAvailabilityRepository) private readonly _availibilityRepo: ITeacherAvailabilityRepository,
    @inject(TYPES.NotificationRepository) private readonly _notificationRepo: INotificationRepository
  ) {
    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }

  async getAvailability(teacherId: string): Promise<IBookingDTO[]> {
    if (!teacherId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const availability = await this._bookingRepo.getAvailability(teacherId);
    return bookingsDto(availability);
  }

  async bookSlot(studentId: string, teacherId: string, courseId: string, date: string, day: string, startTime: string, endTime: string, note: string): Promise<IBookingDTO> {
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    if (!teacherId || !courseId || !date || !day || !startTime || !endTime) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
    const studentIdObj = new Types.ObjectId(studentId);
    const teacherIdObj = new Types.ObjectId(teacherId);
    const courseIdObj = new Types.ObjectId(courseId);

    const booking = await this._bookingRepo.createBooking({
      studentId: studentIdObj,
      teacherId: teacherIdObj,
      courseId: courseIdObj,
      date,
      day,
      slot: {
        start: startTime,
        end: endTime,
      },
      note,
      status: 'pending',
    });
    return bookingDto(booking);
  }

  async cancelBooking(bookingId: string, reason: string): Promise<IBookingDTO> {
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const cancelled = await this._bookingRepo.updateBookingStatus(bookingId, 'cancelled', reason);
    if (!cancelled) throwError(MESSAGES.BOOKING_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return bookingDto(cancelled);
  }

  async approveBooking(bookingId: string): Promise<IBookingDTO> {
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const approved = await this._bookingRepo.updateBookingStatus(bookingId, 'approved');
    if (!approved) throwError(MESSAGES.BOOKING_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return bookingDto(approved);
  }

  async initiatePayment(bookingId: string, amount: number): Promise<{ razorpayOrderId: string, booking: IBooking | null }> {
    if (!bookingId || !amount) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { bookingId },
    };

    const razorpayOrder = await this._razorpay.orders.create(options);

    const updated = await this._bookingRepo.updateBookingOrderId(bookingId, razorpayOrder.id);

    return { razorpayOrderId: razorpayOrder.id, booking: updated };
  }


  async verifyPayment(razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string): Promise<IBooking | null> {
    const crypto = await import('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature)
      throwError('Payment verification failed', STATUS_CODES.BAD_REQUEST);

    const updated = await this._bookingRepo.verifyAndMarkPaid(razorpay_order_id);
    if (!!updated) {
      await this._notificationRepo.createNotification(
        updated.teacherId.toString(),
        'New Booking Confirmed!',
        ' booked a paid session for .',
        'booking',
        'teacher'
      );
    }


    return updated;
  }

  async getHistory(studentId: string, page: number, limit: number, status?: string, teacher?: string): Promise<IPaginatedResult<IBooking>> {
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const history = await this._bookingRepo.getBookingsByStudent(studentId, page, limit, status, teacher);
    return history;
  }
  async getScheduledCalls(studentId: string): Promise<IBookingDTO[]> {
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const scheduledCalls = await this._bookingRepo.getScheduledCalls(studentId);
    return bookingsDto(scheduledCalls);
  }
  async getBookingDetails(bookingId: string): Promise<IBooking> {
    const details = await this._bookingRepo.findById(bookingId);
    if (!details) throw new Error('Booking not found');
    return details;
  }

  async getAvailableSlots(teacherId: string): Promise<IAvailableSlot[]> {
    const availability = await this._availibilityRepo.getAvailabilityByTeacherId(teacherId);
    if (!availability) throwError(MESSAGES.TEACHER_AVAILABILITY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const today = dayjs();
    const nextWeek = today.add(7, 'day');

    const slotsForWeek: IAvailableSlot[] = [];

    for (let d = 0; d < 7; d++) {
      const currentDate = today.add(d, 'day');
      const dayName = currentDate.format('dddd');

      const dayAvailability = availability.week.find(w => w.day === dayName && w.enabled);
      if (!dayAvailability) continue;

      for (const slot of dayAvailability.slots) {
        const slotStart = dayjs(`${currentDate.format('YYYY-MM-DD')}T${slot.start}`);

        slotsForWeek.push({
          date: currentDate.format('YYYY-MM-DD'),
          day: dayName,
          start: slot.start,
          end: slot.end,
          slot: slotStart.toDate(),
        });
      }
    }



    // fetch bookings for next 7 days
    const bookings = await this._bookingRepo.findBookedSlots(
      teacherId,
      today.format('YYYY-MM-DD'),
      nextWeek.format('YYYY-MM-DD')
    );

    // convert booked slots into ISO strings
    const bookedSlots = new Set(
      bookings.map(b => dayjs(`${b.date}T${b.slot.start}`).toISOString())
    );

    // filter out already booked slots
    const availableSlots = slotsForWeek.filter(
      s => !bookedSlots.has(dayjs(s.slot).toISOString())
    );

    // remove duplicates
    const uniqueSlots = Array.from(
      new Map(availableSlots.map(s => [`${s.date}-${s.start}-${s.end}`, s])).values()
    );


    return uniqueSlots;
  }

}
