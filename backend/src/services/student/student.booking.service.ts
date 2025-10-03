// src/services/student/student.booking.service.ts
import { injectable, inject } from "inversify";
import { IStudentBookingService } from "../../core/interfaces/services/student/IStudentBookingService";
import { IStudentBookingRepository } from "../../core/interfaces/repositories/IStudentBookingRepository";
import { TYPES } from "../../core/di/types";
import { IBookingDTO, bookingDto, bookingsDto } from "../../core/dtos/student/student.booking.dto";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import { Types } from "mongoose";
import dayjs from "dayjs";
import { ITeacherAvailabilityRepository } from "../../core/interfaces/repositories/ITeacherAvailabilityRepository";


@injectable()
export class StudentBookingService implements IStudentBookingService {
  constructor(
    @inject(TYPES.StudentBookingRepository) private readonly _bookingRepo: IStudentBookingRepository,
    @inject(TYPES.TeacherAvailabilityRepository) private readonly _availibilityRepo: ITeacherAvailabilityRepository
  ) { }

  async getAvailability(teacherId: string): Promise<IBookingDTO[]> {
    if (!teacherId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const availability = await this._bookingRepo.getAvailability(teacherId);
    return bookingsDto(availability);
  }

  async bookSlot(studentId: string, teacherId: string, courseId: string, date: string, day: string, startTime: string, endTime: string, note: string): Promise<IBookingDTO> {
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    console.log("here everything is fine iam from service")
    
    if (!teacherId || !courseId || !date || !day || !startTime || !endTime) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
    console.log(teacherId,courseId ,studentId)
    const studentIdObj = new Types.ObjectId(studentId);
    const teacherIdObj = new Types.ObjectId(teacherId);
    const courseIdObj = new Types.ObjectId(courseId);

    console.log(studentIdObj,teacherIdObj ,courseIdObj)
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
      status: "pending",
    });
    return bookingDto(booking);
  }

  async cancelBooking(bookingId: string): Promise<IBookingDTO> {
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const cancelled = await this._bookingRepo.updateBookingStatus(bookingId, "cancelled");
    return bookingDto(cancelled);
  }

  async approveBooking(bookingId: string): Promise<IBookingDTO> {
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
    const approved = await this._bookingRepo.updateBookingStatus(bookingId, "approved");
    return bookingDto(approved);
  }

  async payBooking(bookingId: string, paymentDetails: any): Promise<IBookingDTO> {
    if (!bookingId || !paymentDetails) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
    const paid = await this._bookingRepo.updateBookingStatus(bookingId, "paid");
    return bookingDto(paid);
  }

  async getHistory(studentId: string): Promise<IBookingDTO[]> {
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const history = await this._bookingRepo.getBookingsByStudent(studentId);
    return bookingsDto(history);
  }

  async getAvailableSlots(teacherId: string): Promise<any[]> {
    const availability = await this._availibilityRepo.getAvailabilityByTeacherId(teacherId);
    if (!availability) throwError(MESSAGES.TEACHER_AVAILABILITY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const today = dayjs();
    const nextWeek = today.add(7, "day");

    const slotsForWeek: any[] = [];

    for (let d = 0; d < 7; d++) {
      const currentDate = today.add(d, "day");
      const dayName = currentDate.format("dddd");

      const dayAvailability = availability.week.find(w => w.day === dayName && w.enabled);
      if (!dayAvailability) continue;

      for (const slot of dayAvailability.slots) {
        const slotStart = dayjs(`${currentDate.format("DD-MM-YYYY")} ${slot.start}`);

        slotsForWeek.push({
          date: currentDate.format("DD-MM-YYYY"),
          day: dayName,
          start: slot.start,
          end: slot.end,
          slot: slotStart.toDate()
        });
      }
    }

    // fetch bookings for next 7 days
    const bookings = await this._bookingRepo.findBookedSlots(
      teacherId,
      today.toDate(),
      nextWeek.toDate()
    );

    const bookedSlots = new Set(bookings.map(b => dayjs(b.slot).toISOString()));

    // remove already booked
    const availableSlots = slotsForWeek.filter(
      s => !bookedSlots.has(dayjs(s.slot).toISOString())
    );

    // remove duplicates
    const uniqueSlots = Array.from(
      new Map(availableSlots.map(s => [`${s.date}-${s.start}-${s.end}`, s])).values()
    );

    console.log("the final from controller is ", uniqueSlots);

    return uniqueSlots;
  }

}
