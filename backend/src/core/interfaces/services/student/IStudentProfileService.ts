// src/core/interfaces/services/student/IStudentProfileService.ts

import { IStudent } from '../../../../models/Student';
import { studentProfileDto ,IStudentProfileDTO } from '../../../../core/dtos/student/Student.profile.Dto';


export interface IStudentProfileService {
  getProfile(studentId: string): Promise<IStudentProfileDTO>;
  updateStudentProfile(studentId: string, data: Partial<IStudent>): Promise<IStudentProfileDTO>;
}
