import { inject, injectable } from 'inversify';
import { IAdminStudentService } from '../../core/interfaces/services/admin/IAdminStudentService';
import { IStudentRepository } from '../../core/interfaces/repositories/student/IStudentRepository';
import { IStudent } from '../../models/Student';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class AdminStudentService implements IAdminStudentService {
  constructor(
    @inject(TYPES.StudentRepository) private _studentRepo: IStudentRepository
  ) {}

  async createStudent(data: Partial<IStudent>): Promise<IStudent> {
    return this._studentRepo.create(data);
  }

  async getAllStudents(page: number, limit: number, search?: string): Promise<{ students: IStudent[]; total: number ; totalPages:number }> {
    if (page < 1 || limit < 1) {
      throwError(MESSAGES.PAGE_OUT_OF_RANGE, STATUS_CODES.BAD_REQUEST);
    }
    const skip = (page - 1) * limit;
    const students = await this._studentRepo.findAll(skip, limit, search);
    const total = await this._studentRepo.count(search);
     const totalPages = Math.ceil(total / limit); 
    return { students, total , totalPages };
  }

  async getStudentById(studentId: string): Promise<IStudent | null> {
    const student = await this._studentRepo.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return student;
  }

  async updateStudent(id: string, data: Partial<IStudent>): Promise<IStudent> {
    return this._studentRepo.update(id, data);
  }

  async blockStudent(studentId: string): Promise<IStudent> {
    return this._studentRepo.update(studentId, { isBlocked: true });
  }

  async unblockStudent(studentId: string): Promise<IStudent> {
    return this._studentRepo.update(studentId, { isBlocked: false });
  }
}
