import { injectable } from "inversify";
import { IStudentBookingRepository } from "../core/interfaces/repositories/IStudentBookingRepository";
import { Booking, IBooking } from "../models/Booking";
import { Types } from "mongoose";

@injectable()
export class StudentBookingRepository implements IStudentBookingRepository {

  async getAvailability(teacherId: string): Promise<IBooking[]> {
    return await Booking.find({ teacherId: new Types.ObjectId(teacherId) });
  }

  async createBooking(booking: Partial<IBooking>): Promise<IBooking> {
    const newBooking =  new Booking(booking);
    const booked = await newBooking.save();
    console.log("booking is done successfully... this message from repository")
    return booked
  }

  async updateBookingStatus(bookingId: string, status: "pending" | "approved" | "paid" | "cancelled"): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    ).populate("studentId teacherId courseId");
  }

  async getBookingsByStudent(studentId: string): Promise<IBooking[]> {
    return await Booking.find({ studentId: new Types.ObjectId(studentId) })
      .populate("teacherId courseId");
  }

  async findBookedSlots(teacherId :string , today : Date ,nextWeek : Date): Promise<IBooking[]>{
    return await Booking.find({teacherId ,
       slots: { $gte: today, $lte: nextWeek },
       status: { $in: ["pending", "approved", "paid"] },
    })
  }
}
