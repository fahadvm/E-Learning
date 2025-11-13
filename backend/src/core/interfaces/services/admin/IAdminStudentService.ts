// core/interfaces/services/admin/IAdminStudentService.ts
import { IStudent } from '../../../../models/Student';
import { IAdminStudentDTO, PaginatedStudentDTO,  } from '../../../../core/dtos/admin/Admin.student.Dto';

export interface IAdminStudentService {
  createStudent(data: Partial<IStudent>): Promise<IAdminStudentDTO>;
  getAllStudents(page: number, limit: number, search?: string): Promise<any>;
  getStudentById(id: string): Promise<any | null>;
  updateStudent(id: string, data: Partial<IStudent>): Promise<IAdminStudentDTO>;
  blockStudent(id: string): Promise<IAdminStudentDTO>;
  unblockStudent(id: string): Promise<IAdminStudentDTO>;
}
