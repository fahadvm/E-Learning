import { inject, injectable } from 'inversify';
import { IAdminStudentService } from '../../core/interfaces/services/admin/IAdminStudentService';
import { IStudentRepository } from '../../core/interfaces/repositories/student/IStudentRepository';
import { IStudent } from '../../models/Student';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IAdminStudentDTO, PaginatedStudentDTO, adminStudentDto } from '../../core/dtos/admin/Admin.student.Dto';

@injectable()
export class AdminStudentService implements IAdminStudentService {
  constructor(
    @inject(TYPES.StudentRepository)
    private readonly _studentRepo: IStudentRepository
  ) {}

  async createStudent(data: Partial<IStudent>): Promise<IAdminStudentDTO> {
    const student = await this._studentRepo.create(data);
    return adminStudentDto(student);
  }

  async getAllStudents(
    page: number,
    limit: number,
    search?: string
  ): Promise<PaginatedStudentDTO> {
    if (page < 1 || limit < 1) {
      throwError(MESSAGES.PAGE_OUT_OF_RANGE, STATUS_CODES.BAD_REQUEST);
    }

    const skip = (page - 1) * limit;
    const students = await this._studentRepo.findAll(skip, limit, search);
    const total = await this._studentRepo.count(search);
    const totalPages = Math.ceil(total / limit);

    return {
      data: students.map(adminStudentDto),
      total,
      totalPages,
    };
  }

  async getStudentById(studentId: string): Promise<IAdminStudentDTO> {
    const student = await this._studentRepo.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminStudentDto(student);
  }

  async updateStudent(studentId: string, data: Partial<IStudent>): Promise<IAdminStudentDTO> {
    const updated = await this._studentRepo.update(studentId, data);
    return adminStudentDto(updated);
  }

  async blockStudent(studentId: string): Promise<IAdminStudentDTO> {
    const blocked = await this._studentRepo.update(studentId, { isBlocked: true });
    return adminStudentDto(blocked);
  }

  async unblockStudent(studentId: string): Promise<IAdminStudentDTO> {
    const unblocked = await this._studentRepo.update(studentId, { isBlocked: false });
    return adminStudentDto(unblocked);
  }
}
