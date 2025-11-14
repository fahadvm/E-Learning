import { inject, injectable } from 'inversify';
import { IBooking } from '../../models/Booking';
import { ITeacherCallRequestService } from '../../core/interfaces/services/teacher/ITeacherCallRequestService';
import { IStudentBookingRepository } from '../../core/interfaces/repositories/IStudentBookingRepository';
import { TYPES } from '../../core/di/types';
import dayjs from 'dayjs';
import { ITeacherAvailabilityRepository } from '../../core/interfaces/repositories/ITeacherAvailabilityRepository';
import { INotificationRepository } from '../../core/interfaces/repositories/INotificationRepository';
import { IPaginationResponse } from '../../core/dtos/teacher/TeacherDTO';
import { bookingDto, IBookingDTO } from '../../core/dtos/student/student.booking.dto';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IBookingFilter, ITeacherSlot } from '../../types/filter/fiterTypes';


@injectable()
export class TeacherCallRequestService implements ITeacherCallRequestService {
    constructor(
        @inject(TYPES.StudentBookingRepository) private _callRequestRepo: IStudentBookingRepository,
        @inject(TYPES.TeacherAvailabilityRepository) private _availibilityRepo: ITeacherAvailabilityRepository,
        @inject(TYPES.NotificationRepository) private _notificationRepo: INotificationRepository
    ) { }

    async getPendingRequests(page: number, limit: number): Promise<{
        requests: IBooking[]
        totalPages: number
        currentPage: number
    }> {
        return this._callRequestRepo.findPending(page, limit);
    }


    async rescheduleBooking(bookingId: string, reason: string, nextSlot: { start: string; end: string; date: string ,day:string}): Promise<IBookingDTO> {
        if (!bookingId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
        const reschedulled = await this._callRequestRepo.requestReschedule(bookingId, reason, nextSlot);
        if (!reschedulled) throwError(MESSAGES.BOOKING_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        return bookingDto(reschedulled);
    }

    async getConfirmedRequests(): Promise<IBooking[]> {
        return this._callRequestRepo.findConfirmed();
    }

    async getRequestDetails(bookingId: string): Promise<IBooking | null> {
        return this._callRequestRepo.findById(bookingId);
    }

    async getTeacherSlots(teacherId: string): Promise<ITeacherSlot[] | null> {
        const availability = await this._availibilityRepo.getAvailabilityByTeacherId(teacherId);
        if (!availability) return [];

        const today = dayjs();
        const next7Days = Array.from({ length: 7 }, (_, i) => today.add(i, 'day'));

        const results: ITeacherSlot[] = [];

        for (const date of next7Days) {
            const dayName = date.format('dddd');
            const formattedDate = date.format('YYYY-MM-DD'); // <-- fix here

            const matchingDay = availability.week.find(
                (d) => d.day === dayName && d.enabled
            );
            if (!matchingDay) continue;

            for (const slot of matchingDay.slots) {
                const booking = await this._callRequestRepo.findByTeacherDateSlot(
                    teacherId,
                    formattedDate,
                    slot
                );
                results.push({
                    _id: booking?._id.toString() ?? `${formattedDate}-${slot}`,
                    date: formattedDate,
                    day: dayName,
                    slot,
                    status: booking ? booking.status : 'available',
                    student: booking?.studentId ,
                    course: booking?.courseId ,
                    callId:booking?.callId
                });
            }
        }


        return results;
    }


    async approveRequest(bookingId: string): Promise<IBooking | null> {
        const updated = await this._callRequestRepo.updateBookingStatus(bookingId, 'approved');

        if (!!updated) {
            await this._notificationRepo.createNotification(
                updated.studentId?._id.toString(),
                'Your Booking request approved!',
                ' Teacher approved request you can pay now .',
                'booking',
                'student'
            );
        }
        return updated;

    }

    async rejectRequest(bookingId: string, reason: string): Promise<IBooking | null> {
        return this._callRequestRepo.rejectBooking(bookingId, reason);
    }

    async getHistory(teacherId: string, page: number, limit: number, status?: string): Promise<IPaginationResponse<IBooking>> {
        const skip = (page - 1) * limit;

        const filter: IBookingFilter = { teacherId };
        if (status) filter.status = status;

        const [records, total] = await Promise.all([
            this._callRequestRepo.getHistory(filter, skip, limit),
            this._callRequestRepo.countHistory(filter),
        ]);

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            data: records,
        };
    }
}
