// src/controllers/student/student.booking.controller.ts
import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IStudentBookingService } from "../../core/interfaces/services/student/IStudentBookingService";
import { IStudentBookingController } from "../../core/interfaces/controllers/student/IStudentBookingController";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

@injectable()
export class StudentBookingController implements IStudentBookingController {
  constructor(
    @inject(TYPES.StudentBookingService)
    private readonly _bookingService: IStudentBookingService
  ) {}

  getAvailability = async (req: AuthRequest, res: Response) => {
    const { teacherId } = req.params;
    if (!teacherId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const availability = await this._bookingService.getAvailability(teacherId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.AVAILABILITY_FETCHED, true, availability);
  };

  bookSlot = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    console.log("booked data ", req.body)
    const { teacherId, courseId, date, day, startTime, endTime, note  } = req.body;
    if (!teacherId || !courseId|| !date|| !day|| !startTime|| !endTime )
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const booking = await this._bookingService.bookSlot(studentId ,teacherId, courseId, date, day, startTime, endTime, note);
    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.BOOKING_CREATED, true, booking);
  };

  cancelBooking = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params;
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.cancelBooking(bookingId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_CANCELLED, true, result);
  };

  approveBooking = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params;
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.approveBooking(bookingId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_APPROVED, true, result);
  };

  payBooking = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { bookingId, paymentDetails } = req.body;
    if (!bookingId || !paymentDetails)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.payBooking(bookingId, paymentDetails);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_SUCCESS, true, result);
  };

  getHistory = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const history = await this._bookingService.getHistory(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.HISTORY_FETCHED, true, history);
  };

  AvailableBookingSlots = async (req:AuthRequest , res: Response) =>{
     const { teacherId } = req.params;
     const slots = await this._bookingService.getAvailableSlots(teacherId);
     return sendResponse(res,STATUS_CODES.OK, MESSAGES.AVAILABLE_SLOTS_FETCHED, true, slots )

  }
}
