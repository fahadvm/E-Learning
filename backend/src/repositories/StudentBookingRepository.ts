import { injectable } from 'inversify';
import { IStudentBookingRepository, IPaginatedResult, IPendingResult } from '../core/interfaces/repositories/IStudentBookingRepository';
import { Booking, IBooking } from '../models/Booking';
import { Types } from 'mongoose';
import { IBookingFilter } from '../types/filter/fiterTypes';
import { throwError } from '../utils/ResANDError';
import { MESSAGES } from '../utils/ResponseMessages';
import { STATUS_CODES } from '../utils/HttpStatuscodes';

@injectable()
export class StudentBookingRepository implements IStudentBookingRepository {

  async getAvailability(teacherId: string): Promise<IBooking[]> {
    return await Booking.find({ teacherId: new Types.ObjectId(teacherId) });
  }

  async getScheduledCalls(studentId: string): Promise<IBooking[]> {
    const today = new Date().toISOString().split('T')[0];
    return Booking.find({
      studentId,
      status: 'paid',
      date: { $gte: today }
    })
      .populate('teacherId', 'name email profilePicture')
      .populate('courseId', 'title')
      .sort({ date: 1 });
  }

  async createBooking(booking: Partial<IBooking>): Promise<IBooking> {
    const newBooking = new Booking(booking);
    return await newBooking.save();
  }

  async findByTeacherDateSlot(
    teacherId: string,
    date: string,
    slot: { start: string; end: string }
  ): Promise<IBooking | null> {
    return Booking.findOne({
      teacherId,
      date,
      'slot.start': slot.start,
      'slot.end': slot.end,
      status: { $in: ['paid', 'cancelled'] },
    }).populate({
      path: 'studentId',
      select: 'name email',
    })
      .populate({
        path: 'courseId',
        select: 'title',
      });
  }

  async updateBookingStatus(
    bookingId: string,
    status: 'pending' | 'approved' | 'paid' | 'cancelled' | 'rejected',
    reason?: string
  ): Promise<IBooking | null> {
    const updateData =
      status === 'cancelled' && reason
        ? { status, cancellationReason: reason }
        : { status };

    return await Booking.findByIdAndUpdate(bookingId, updateData, { new: true })
      .populate('studentId teacherId courseId');
  }

  async getBookingsByStudent(
    studentId: string,
    page: number,
    limit: number,
    status?: string,
  ): Promise<IPaginatedResult<IBooking>> {
    const query: Record<string, unknown> = { studentId };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Booking.find(query)
        .populate('teacherId')
        .populate('courseId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(query),
    ]);

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  async findBookedSlots(
    teacherId: string,
    today: string,
    nextWeek: string
  ): Promise<IBooking[]> {
    return await Booking.find({
      teacherId,
      slots: { $gte: today, $lte: nextWeek },
      status: { $in: ['pending', 'approved', 'paid'] },
    });
  }

  async findPending(page: number, limit: number): Promise<IPendingResult> {
    const skip = (page - 1) * limit;

    const [requests, totalCount] = await Promise.all([
      Booking.find({ status: 'pending' })
        .populate('studentId', 'name profilePicture')
        .populate('courseId', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments({ status: 'pending' }),
    ]);

    return {
      requests,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findConfirmed(): Promise<IBooking[]> {
    return Booking.find({ status: 'confirmed' }).populate('studentId teacherId');
  }

  async findById(bookingId: string): Promise<IBooking | null> {
    return Booking.findById(bookingId).populate('studentId courseId teacherId');
  }
 


   async findByPaymentId(paymentOrderId: string): Promise<IBooking | null>{
    return Booking.findOne({paymentOrderId}).lean().exec();
  }

  async rejectBooking(bookingId: string, reason: string): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(
      bookingId,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );
  }

  async updateBookingOrderId(
    bookingId: string,
    orderId: string
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { paymentOrderId: orderId },
      { new: true }
    );
  }

  async findByOrderId(orderId: string): Promise<IBooking | null> {
    return await Booking.findOne({ paymentOrderId: orderId });
  }

  async verifyAndMarkPaid(orderId: string, callId:string): Promise<IBooking | null> {
    const paidBooking = await Booking.findOneAndUpdate(
      { paymentOrderId: orderId },
      { status: 'paid',callId },
      { new: true }
    );

    if (!paidBooking) return null;

    await Booking.updateMany(
      {
        _id: { $ne: paidBooking._id },
        teacherId: paidBooking.teacherId,
        date: paidBooking.date,
        'slot.start': paidBooking.slot.start,
        'slot.end': paidBooking.slot.end,
        status: 'pending'
      },
      {
        $set: {
          status: 'cancelled',
          cancellationReason: 'Slot booked by someone else'
        }
      }
    );

    return paidBooking;
  }

  async getHistory(
    filter: IBookingFilter,
    skip: number,
    limit: number
  ): Promise<IBooking[]> {
    return Booking.find(filter)
      .populate('studentId', 'name email')
      .populate('courseId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countHistory(filter: IBookingFilter): Promise<number> {
    return Booking.countDocuments(filter);
  }

  async rescheduleBooking(
    bookingId: string,
    reason: string,
    nextSlot: { start: string; end: string; date: string ,day:string}
  ): Promise<IBooking> {
    const oldBooking = await Booking.findById(bookingId);
    if (!oldBooking) throwError(MESSAGES.BOOKING_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const newBooking = await Booking.create({
      teacherId: oldBooking.teacherId,
      studentId: oldBooking.studentId,
      courseId: oldBooking.courseId,
      note:oldBooking.note,
      paymentOrderId:oldBooking.paymentOrderId,
      day: nextSlot.day,  
      date: nextSlot.date,
      slot: {
        start: nextSlot.start,
        end: nextSlot.end,
      },
      status: 'paid',
      rescheduledFrom: oldBooking._id,
    });

    await Booking.findByIdAndUpdate(oldBooking._id, {
      status: 'rescheduled',
      rescheduledTo: newBooking._id,
      rescheduledReason: reason,
      rescheduledAt: new Date(),
    });

    return newBooking;
  }

}
