// core/interfaces/services/admin/IAdminStudentService.ts
import { IStudent } from '../../../../models/Student';
import { IAdminStudentDetailsDTO, IAdminStudentListDTO,   } from '../../../../core/dtos/admin/Admin.student.Dto';

export interface IAdminStudentService {
  getAllStudents(page: number, limit: number, search: string , status: string): Promise<{ data: IAdminStudentListDTO[]; total: number }>;
  getStudentById(id: string): Promise<IAdminStudentDetailsDTO>;
  blockStudent(id: string): Promise<any>;
  unblockStudent(id: string): Promise<any>;
}
