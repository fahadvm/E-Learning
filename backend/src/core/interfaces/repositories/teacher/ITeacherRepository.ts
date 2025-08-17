import { ITeacher } from '../../../../models/Teacher';

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

  findAll(params?: { skip?: number; limit?: number; search?: string }): Promise<ITeacher[]>;
  count(search?: string): Promise<number>;

  getUnverifiedTeachers(): Promise<ITeacher[]>;
  findUnverified(): Promise<ITeacher[]>;
  verifyTeacherById(id: string): Promise<ITeacher | null>;
  rejectTeacherById(id: string): Promise<ITeacher | null>;
  updateStatus(teacherId: string, updates: Partial<ITeacher>): Promise<ITeacher | null>;
}
