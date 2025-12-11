import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IStudentBookingService } from '../../core/interfaces/services/student/IStudentBookingService';
import { IStudentBookingController } from '../../core/interfaces/controllers/student/IStudentBookingController';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IStudentSubscriptionService } from '../../core/interfaces/services/student/IStudentSubscriptionService';

@injectable()
export class StudentBookingController implements IStudentBookingController {
  constructor(
    @inject(TYPES.StudentBookingService)
    private readonly _bookingService: IStudentBookingService,

    @inject(TYPES.StudentSubscriptionService)
    private readonly _subscriptionService: IStudentSubscriptionService
  ) {}

  getAvailability = async (req: AuthRequest, res: Response) => {
    const { teacherId } = req.params;
    if (!teacherId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const availability = await this._bookingService.getAvailability(teacherId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.AVAILABILITY_FETCHED, true, availability);
  };

  lockSlot = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const canAccess = await this._subscriptionService.hasFeature(studentId, "Video Call");
    if (!canAccess) throwError(MESSAGES.FEATURE_NOT_ALLOWED, STATUS_CODES.FORBIDDEN);

    const { teacherId, courseId, date, day, startTime, endTime, note } = req.body;
    if (!teacherId || !courseId || !date || !day || !startTime || !endTime)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.lockingSlot(
      studentId, teacherId, courseId, date, day, startTime, endTime, note
    );

    return sendResponse(res, STATUS_CODES.CREATED, MESSAGES.BOOKING_CREATED, true, result);
  };

  bookingDetails = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params;
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const booking = await this._bookingService.getBookingDetails(bookingId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_DETAILS_FETCHED, true, booking);
  };

  bookingDetailsByPaymentId = async (req: AuthRequest, res: Response) => {
    const { paymentOrderId } = req.params;
    if (!paymentOrderId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const booking = await this._bookingService.getBookingDetailsByPaymentId(paymentOrderId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_DETAILS_FETCHED, true, booking);
  };

  cancelBooking = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params;
    const { reason } = req.body;
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.cancelBooking(bookingId, reason);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_CANCELLED, true, result);
  };

  approveBooking = async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params;
    if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.approveReschedule(bookingId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_APPROVED, true, result);
  };

  payBooking = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { bookingId, amount } = req.body;
    if (!bookingId || !amount)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const result = await this._bookingService.initiatePayment(bookingId, amount);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_SUCCESS, true, result);
  };

  verifyPayment = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)
      throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);

    const verified = await this._bookingService.verifyPayment(
      razorpay_order_id, razorpay_payment_id, razorpay_signature
    );

    if (verified)
      return sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, verified);

    return sendResponse(res, STATUS_CODES.BAD_REQUEST, MESSAGES.PAYMENT_VERIFICATION_FAILED, false, verified);
  };

  getHistory = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { page = 1, limit = 5, status } = req.query;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const history = await this._bookingService.getHistory(
      studentId, Number(page), Number(limit), status as string
    );

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.HISTORY_FETCHED, true, history);
  };

  ScheduledCalls = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const schedules = await this._bookingService.getScheduledCalls(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUESTS_FETCHED, true, schedules);
  };

  AvailableBookingSlots = async (req: AuthRequest, res: Response) => {
    const { teacherId } = req.params;
    const slots = await this._bookingService.getAvailableSlots(teacherId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.AVAILABLE_SLOTS_FETCHED, true, slots);
  };
}
