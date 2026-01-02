// services/admin/AdminTeacherService.ts
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminTeacherService } from '../../core/interfaces/services/admin/IAdminTeacherService';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import {
    adminTeacherDto,
    adminTeacherDetailsDto,
    IAdminTeacherDTO,
    IAdminTeacherDetailsDTO,
    PaginatedTeacherDTO
} from '../../core/dtos/admin/Admin.teacher.Dto';
import { ITransactionRepository } from '../../core/interfaces/repositories/ITransactionRepository';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { ITeacher } from '../../models/Teacher';

@injectable()
export class AdminTeacherService implements IAdminTeacherService {
    constructor(
        @inject(TYPES.TeacherRepository) private readonly _teacherRepo: ITeacherRepository,
        @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
        @inject(TYPES.TransactionRepository) private readonly _transactionRepo: ITransactionRepository,
        @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
    ) { }

    async getAllTeachers(
        page: number,
        limit: number,
        search?: string,
        status?: string
    ): Promise<PaginatedTeacherDTO> {
        const skip = (page - 1) * limit;
        const teachers = await this._teacherRepo.findAll({ skip, limit, search, status });
        const total = await this._teacherRepo.count(search, status);
        const totalPages = Math.ceil(total / limit);
        const data = await Promise.all(
            teachers.map(async (teacher) => {
                const courses = await this._courseRepo.findByTeacherId(teacher._id.toString());
                const totalCourses = courses.length;
                const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);
                const totalEarnings = await this._transactionRepo.teacherEarnings(teacher._id.toString());
                const teacherObj = (teacher.toObject ? teacher.toObject() : teacher) as ITeacher;
                return adminTeacherDto({
                    ...teacherObj,
                    totalCourses,
                    totalStudents,
                    totalEarnings
                } as unknown as ITeacher & { totalCourses?: number; totalStudents?: number; totalEarnings?: number });
            })
        );
        return { data, total, totalPages };
    }

    async getVerificationRequests(page: number, limit: number, search: string): Promise<PaginatedTeacherDTO> {
        const skip = (page - 1) * limit;
        const teachers = await this._teacherRepo.findPendingRequests({ skip, limit, search });
        const total = await this._teacherRepo.countPendingRequests(search);
        const totalPages = Math.ceil(total / limit);

        const data = teachers.map(t => adminTeacherDto(t));
        return { data, total, totalPages };
    }

    async getTeacherById(teacherId: string): Promise<IAdminTeacherDetailsDTO> {
        const teacher = await this._teacherRepo.findById(teacherId);
        if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        const courses = await this._courseRepo.findByTeacherId(teacherId);
        const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);
        const totalEarnings = await this._transactionRepo.teacherEarnings(teacherId);

        const teacherObj = (teacher.toObject ? teacher.toObject() : teacher) as ITeacher;
        const teacherWithStats = {
            ...teacherObj,
            totalStudents,
            totalEarnings
        };

        return adminTeacherDetailsDto({
            teacher: teacherWithStats as unknown as ITeacher,
            courses
        });
    }

    async getUnverifiedTeachers(): Promise<IAdminTeacherDTO[]> {
        const teachers = await this._teacherRepo.findUnverified();
        if (!teachers) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        return teachers.map(adminTeacherDto);
    }

    async verifyTeacher(teacherId: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.verifyTeacherById(teacherId);
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        await this._notificationService.createNotification(
            teacherId,
            'Profile Verified',
            'Your teacher profile has been verified. You can now start creating courses.',
            'profile',
            'teacher',
            '/teacher/profile'
        );

        return adminTeacherDto(updated);
    }

    async rejectTeacher(teacherId: string, reason: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.rejectTeacherById(teacherId, reason);
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        await this._notificationService.createNotification(
            teacherId,
            'Profile Verification Rejected',
            `Your profile verification was rejected by admin. Reason: ${reason}`,
            'profile',
            'teacher',
            '/teacher/profile'
        );

        return adminTeacherDto(updated);
    }

    async blockTeacher(teacherId: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.updateStatus(teacherId, { isBlocked: true });
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        await this._courseRepo.unpublishByTeacherId(teacherId);

        return adminTeacherDto(updated);
    }

    async unblockTeacher(teacherId: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.updateStatus(teacherId, { isBlocked: false });
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        return adminTeacherDto(updated);
    }
}
