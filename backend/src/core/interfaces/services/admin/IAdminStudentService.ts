// core/interfaces/services/admin/IAdminStudentService.ts
import { IAdminStudentDTO, PaginatedStudentDTO,  } from '../../../../core/dtos/admin/Admin.student.Dto';

export interface IAdminStudentService {
  createStudent(data: Partial<IAdminStudentDTO>): Promise<IAdminStudentDTO>;
  getAllStudents(page: number, limit: number, search?: string): Promise<PaginatedStudentDTO>;
  getStudentById(id: string): Promise<IAdminStudentDTO | null>;
  updateStudent(id: string, data: Partial<IAdminStudentDTO>): Promise<IAdminStudentDTO>;
  blockStudent(id: string): Promise<IAdminStudentDTO>;
  unblockStudent(id: string): Promise<IAdminStudentDTO>;
}
