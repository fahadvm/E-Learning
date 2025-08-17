import { inject, injectable } from 'inversify';
import { IAdminTeacherService } from '../../core/interfaces/services/admin/IAdminTeacherService';
import { ITeacherRepository } from '../../core/interfaces/repositories/teacher/ITeacherRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IAdminTeacherDTO, PaginatedTeacherDTO, adminTeacherDto } from '../../core/dtos/admin/Admin.teacher.Dto';

@injectable()
export class AdminTeacherService implements IAdminTeacherService {
    constructor(
        @inject(TYPES.TeacherRepository)
        private readonly _teacherRepo: ITeacherRepository
    ) { }

    async getAllTeachers(page: number, limit: number, search?: string): Promise<PaginatedTeacherDTO> {
        const skip = (page - 1) * limit;
        const teachers = await this._teacherRepo.findAll({ skip, limit, search });
        const total = await this._teacherRepo.count(search);
        const totalPages = Math.ceil(total / limit);

        return {
            data: teachers.map(adminTeacherDto),
            total,
            totalPages
        };
    }

    async getUnverifiedTeachers(): Promise<IAdminTeacherDTO[]> {
        const teachers = await this._teacherRepo.findUnverified();
        if (!teachers) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        return teachers.map(adminTeacherDto);
    }

    async verifyTeacher(teacherId: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.updateStatus(teacherId, { isVerified: true, isRejected: false });
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        return adminTeacherDto(updated);
    }

    async rejectTeacher(teacherId: string): Promise<IAdminTeacherDTO > {
        const updated = await this._teacherRepo.updateStatus(teacherId, { isVerified: false, isRejected: true });
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        return adminTeacherDto(updated);
    }

    async blockTeacher(teacherId: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.updateStatus(teacherId, { isBlocked: true });
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        return adminTeacherDto(updated);
    }

    async unblockTeacher(teacherId: string): Promise<IAdminTeacherDTO> {
        const updated = await this._teacherRepo.updateStatus(teacherId, { isBlocked: false });
        if (!updated) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND)
        return adminTeacherDto(updated);
    }
}
