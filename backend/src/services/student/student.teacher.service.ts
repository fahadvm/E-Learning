import { inject, injectable } from 'inversify';
import { IStudentTeacherService } from '../../core/interfaces/services/student/IStudentTeacherService';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { ITeacherAvailabilityRepository } from '../../core/interfaces/repositories/ITeacherAvailabilityRepository';
import { TYPES } from '../../core/di/types';
import { ITeacher } from '../../models/Teacher';
import { ITeacherAvailability } from '../../models/TeacherAvailability';

@injectable()
export class StudentTeacherService implements IStudentTeacherService {
  constructor(
    @inject(TYPES.TeacherRepository)
    private readonly _teacherRepo: ITeacherRepository,
    @inject(TYPES.TeacherAvailabilityRepository)
    private readonly _availabilityRepo: ITeacherAvailabilityRepository
  ) {}

  async getProfile(teacherId: string ): Promise<ITeacher | null> {

    return this._teacherRepo.findById(teacherId);
  }

  async getAvailability(teacherId: string): Promise<ITeacherAvailability | null> {
    return this._availabilityRepo.getAvailabilityByTeacherId(teacherId);
  }

    async getTopTeachers(): Promise<ITeacher[]> {
    return this._teacherRepo.findTopTeachers();
  }
}
