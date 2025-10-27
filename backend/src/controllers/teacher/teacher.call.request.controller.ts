import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { ITeacherCallRequestService } from '../../core/interfaces/services/teacher/ITeacherCallRequestService';
import { ITeacherCallRequestController } from '../../core/interfaces/controllers/teacher/ITeacherCallRequestController';
@injectable()
export class TeacherCallRequestController implements ITeacherCallRequestController {
    constructor(
        @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,

        @inject(TYPES.TeacherCallRequestService) private readonly _callRequestService: ITeacherCallRequestService
    ) { }

    async getPendingRequests(req: AuthRequest, res: Response): Promise<void> {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const requests = await this._callRequestService.getPendingRequests(page, limit);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUESTS_FETCHED, true, requests);
    }
    async getMySlots(req: AuthRequest, res: Response) {
        const teacherId = req.user?.id;
        if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        const slots = await this._callRequestService.getTeacherSlots(teacherId);
        sendResponse(res, STATUS_CODES.OK, 'Slots fetched successfully', true, slots);
    }

    async getConfirmedRequests(req: AuthRequest, res: Response): Promise<void> {
        const requests = await this._callRequestService.getConfirmedRequests();
        sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUESTS_FETCHED, true, requests);
    }

    async getRequestDetails(req: AuthRequest, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const request = await this._callRequestService.getRequestDetails(bookingId);
        if (!request) throwError(MESSAGES.CALL_REQUEST_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUEST_DETAILS_FETCHED, true, request);
    }

    async approveRequest(req: AuthRequest, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const updated = await this._callRequestService.approveRequest(bookingId);
        if (!updated) throwError(MESSAGES.CALL_REQUEST_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUEST_APPROVED, true, updated);
    }

    async rejectRequest(req: AuthRequest, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const { reason } = req.body;
        const updated = await this._callRequestService.rejectRequest(bookingId, reason);
        if (!updated) throwError(MESSAGES.CALL_REQUEST_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUEST_REJECTED, true, updated);
    }
    async atest(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.params.userId;
        if (!userId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        const notifications = await this._notificationService.getUserNotifications(userId);
        const updated = { name: ' fahad' };
        if (!updated) throwError(MESSAGES.CALL_REQUEST_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.CALL_REQUEST_REJECTED, true, notifications);
    }
    async atestmark(req: AuthRequest, res: Response): Promise<void> {
        const { notificationId } = req.body;
        if (!notificationId) throwError(MESSAGES.NOTIFICATION_ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const updatedNotification = await this._notificationService.markAsRead(notificationId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATION_MARKED_AS_READ, true, updatedNotification);
    }

    async getRequestHistory(req: AuthRequest, res: Response): Promise<void> {
        const { page = 1, limit = 5, status } = req.query;
        const teacherId = req.user?.id;
        if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        const result = await this._callRequestService.getHistory(teacherId, Number(page), Number(limit), status as string);
        sendResponse(res, STATUS_CODES.OK, 'Booking history fetched suceessfully', true, result);
    }


    async rescheduleRequest(req: AuthRequest, res: Response): Promise<void> {
        const { bookingId } = req.params;
        const { reason , nextSlot } = req.body;
        if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);

        const result = await this._callRequestService.rescheduleBooking(bookingId, reason ,nextSlot);

        return sendResponse(res, STATUS_CODES.OK, MESSAGES.BOOKING_CANCELLED, true, result);
    }
}
