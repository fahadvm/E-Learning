// core/interfaces/services/admin/IAdminStudentService.ts
import { IStudent } from '../../../../models/Student';

export interface IAdminStudentService {
  createStudent(data: Partial<IStudent>): Promise<IStudent>;
  getAllStudents(page: number, limit: number, search?: string): Promise<{ students: IStudent[]; total: number ;totalPages:number }>;
  getStudentById(id: string): Promise<IStudent | null>;
  updateStudent(id: string, data: Partial<IStudent>): Promise<IStudent>;
  blockStudent(id: string): Promise<IStudent>;
  unblockStudent(id: string): Promise<IStudent>;
}
