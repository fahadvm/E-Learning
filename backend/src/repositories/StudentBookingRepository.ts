import { injectable } from "inversify";
import { IStudentBookingRepository } from "../core/interfaces/repositories/IStudentBookingRepository";
import { Booking, IBooking } from "../models/Booking";
import { Types } from "mongoose";

@injectable()
export class StudentBookingRepository implements IStudentBookingRepository {

  async getAvailability(teacherId: string): Promise<IBooking[]> {
    return await Booking.find({ teacherId: new Types.ObjectId(teacherId) });
  }

  async getScheduledCalls(studentId: string): Promise<IBooking[]> {
    const today = new Date().toISOString().split("T")[0];

    return Booking.find({
      studentId,
      status: "paid",
      date: { $gte: today }
    })
      .populate("teacherId", "name email profilePicture")
      .populate("courseId", "title")
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
    console.log("coming arguments are", teacherId, date, slot)
    return Booking.findOne({
      teacherId,
      date,
      "slot.start": slot.start,
      "slot.end": slot.end,
      status: { $in: ["paid", "cancelled"] },
    }).populate("studentId  courseId");;
  }

  async updateBookingStatus(bookingId: string, status: "pending" | "approved" | "paid" | "cancelled", reason?: string): Promise<IBooking | null> {

    if (status == "cancelled" && reason) {
      return await Booking.findByIdAndUpdate(
        bookingId,
        { status, cancellationReason: reason },
        { new: true }
      ).populate("studentId teacherId courseId");
    } else {
      return await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
      ).populate("studentId teacherId courseId");
    }

  }

  async getBookingsByStudent(studentId: string, page: number, limit: number, status?: string, teacher?: string): Promise<any> {
    const query: any = { studentId };

    if (status) query.status = status;

    // If filtering by teacher name
    let teacherFilter: any = {};
    if (teacher) {
      teacherFilter = {
        "teacherId.name": { $regex: teacher, $options: "i" },
      };
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Booking.find({ ...query })
        .populate("teacherId")
        .populate("courseId")
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

  async findBookedSlots(teacherId: string, today: string, nextWeek: string): Promise<IBooking[]> {
    return await Booking.find({
      teacherId,
      slots: { $gte: today, $lte: nextWeek },
      status: { $in: ["pending", "approved", "paid"] },
    })
  }

  async findPending(page: number, limit: number): Promise<any> {
    const skip = (page - 1) * limit

    const [requests, totalCount] = await Promise.all([
      Booking.find({ status: "pending" })
        .populate("studentId", "name profilePicture")
        .populate("courseId", "title")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments({ status: "pending" }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return {
      requests,
      totalPages,
      currentPage: page,
    }
  }

  async findConfirmed(): Promise<IBooking[]> {
    return Booking.find({ status: "confirmed" }).populate("studentId teacherId")
  }

  async findById(bookingId: string): Promise<IBooking | null> {
    return Booking.findById(bookingId).populate("studentId courseId teacherId")
  }

  async rejectBooking(bookingId: string, reason: string): Promise<IBooking | null> {
    return Booking.findByIdAndUpdate(
      bookingId,
      { status: "rejected", rejectionReason: reason },
      { new: true }
    );
  }

  async updateBookingOrderId(bookingId: string, orderId: string): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { "paymentOrderId": orderId },
      { new: true }
    );
  }
  async findByOrderId(orderId: string): Promise<IBooking | null> {
    return await Booking.findOne({ "paymentOrderId": orderId });
  }

  async verifyAndMarkPaid(orderId: string): Promise<IBooking | null> {
    return await Booking.findOneAndUpdate(
      { "paymentOrderId": orderId },
      { status: "paid" }, { new: true }
    );
  }


  async getHistory(filter: any, skip: number, limit: number): Promise<IBooking[]> {
    return Booking.find(filter)
      .populate("studentId", "name email")
      .populate("courseId", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countHistory(filter: any): Promise<number> {
    return Booking.countDocuments(filter);
  }







}
