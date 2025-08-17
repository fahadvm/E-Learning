import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/DI/types';
import { IStudentProfileService } from '../../core/interfaces/services/student/IStudentProfileService';
import { IStudentRepository } from '../../core/interfaces/repositories/student/IStudentRepository';
import { IStudent } from '../../models/Student';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class StudentProfileService implements IStudentProfileService {
  constructor(
    @inject(TYPES.StudentRepository)
    private readonly _studentRepo: IStudentRepository
  ) {}

  async getProfile(studentId: string): Promise<IStudent> {
    const student = await this._studentRepo.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return student;
  }

  async updateStudentProfile(studentId: string, data: Partial<IStudent>): Promise<IStudent> {
    const updated = await this._studentRepo.update(studentId, data);
    if (!updated) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }
}
