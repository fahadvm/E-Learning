import { inject, injectable } from 'inversify';
import { IEmployeeTeacherService } from '../../core/interfaces/services/employee/IEmployeeTeacherService';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { TYPES } from '../../core/di/types';
import { ITeacher } from '../../models/Teacher';

@injectable()
export class EmployeeTeacherService implements IEmployeeTeacherService {
    constructor(
        @inject(TYPES.TeacherRepository)
        private readonly _teacherRepo: ITeacherRepository
    ) { }

    async getProfile(teacherId: string): Promise<ITeacher | null> {
        return this._teacherRepo.findById(teacherId);
    }

    async getTopTeachers(): Promise<ITeacher[]> {
        return this._teacherRepo.findTopTeachers();
    }
}
