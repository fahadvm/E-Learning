import { ITeacher } from '../../../../models/Teacher';
import { ITeacherAvailability } from '../../../../models/TeacherAvailability';

export interface IStudentTeacherService {
  getProfile(teacherId: string ,): Promise<ITeacher | null>;
  getAvailability(teacherId: string): Promise<ITeacherAvailability | null>;
}
