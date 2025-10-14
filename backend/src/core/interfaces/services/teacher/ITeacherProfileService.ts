import { ITeacher } from '../../../../models/Teacher';

export interface ITeacherProfileService {
  createProfile(data: Partial<ITeacher>): Promise<ITeacher>;
  updateProfile(teacherId: string, data: Partial<ITeacher>): Promise<ITeacher | null>;
  getProfile(teacherId: string): Promise<ITeacher | null>;
    sendVerificationRequest(teacherId: string ,file : Express.Multer.File ):Promise<ITeacher > 

}
