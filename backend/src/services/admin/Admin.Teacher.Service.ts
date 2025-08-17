import { inject, injectable } from 'inversify';
import { IAdminTeacherService } from '../../core/interfaces/services/admin/IAdminTeacherService';
import { ITeacherRepository } from '../../core/interfaces/repositories/teacher/ITeacherRepository';
import { TYPES } from '../../core/di/types';

@injectable()
export class AdminTeacherService implements IAdminTeacherService {
    constructor(
        @inject(TYPES.TeacherRepository)
        private readonly _teacherRepo: ITeacherRepository
    ) {}

    async getAllTeachers(page: number, limit: number, search: string) {
        const skip = (page - 1) * limit;
        const teachers = await this._teacherRepo.findAll({ skip, limit, search });
        const total = await this._teacherRepo.count(search);
        return { teachers, total };
    }

    async getUnverifiedTeachers() {
        return this._teacherRepo.findUnverified();
    }

    async verifyTeacher(teacherId: string) {
        return this._teacherRepo.updateStatus(teacherId, { isVerified: true, isRejected: false });
    }

    async rejectTeacher(teacherId: string) {
        return this._teacherRepo.updateStatus(teacherId, { isVerified: false, isRejected: true });
    }

    async blockTeacher(teacherId: string) {
        return this._teacherRepo.updateStatus(teacherId, { isBlocked: true });
    }

    async unblockTeacher(teacherId: string) {
        return this._teacherRepo.updateStatus(teacherId, { isBlocked: false });
    }
}
