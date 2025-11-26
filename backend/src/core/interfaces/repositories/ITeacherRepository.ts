import { ITeacher, VerificationStatus } from '../../../models/Teacher';
import { PaginatedTeacherDTO } from '../../dtos/admin/Admin.teacher.Dto';

export interface ITeacherRepository {
  create(teacher: Partial<ITeacher>): Promise<ITeacher>;
  updateById(id: string, data: Partial<ITeacher>): Promise<ITeacher | null>;
  findById(teacherId: string): Promise<ITeacher | null>;
  findOne(filter: Partial<ITeacher>): Promise<ITeacher | null>;

  findByEmail(email: string): Promise<ITeacher | null>;
  updateByEmail(email: string, updateData: Partial<ITeacher>): Promise<ITeacher | null>;

  addProfile(profile: ITeacher): Promise<ITeacher>;
  editProfile(id: string, data: Partial<ITeacher>): Promise<ITeacher | null>;
  getProfileByUserId(userId: string): Promise<ITeacher | null>;

  findAll(params?: { skip?: number; limit?: number; search?: string ,status?:string}): Promise<ITeacher[]>;
  count(search?: string,status?:string): Promise<number>;

  findPendingRequests(params?: { skip?: number; limit?: number; search?: string }): Promise<ITeacher[]>;
  countPendingRequests(search?: string): Promise<number>;
  findUnverified(): Promise<ITeacher[]>;
  verifyTeacherById(id: string): Promise<ITeacher | null>;
  rejectTeacherById(id: string , reason: string): Promise<ITeacher | null>;
  updateStatus(teacherId: string, updates: Partial<ITeacher>): Promise<ITeacher | null>;
  sendVerificationRequest(id: string, status: VerificationStatus ,resumeUrl:string): Promise<ITeacher | null>
  updateVerificationStatus(id: string, status: VerificationStatus): Promise<ITeacher | null>
  isProfileComplete(id: string): Promise<boolean>
}
