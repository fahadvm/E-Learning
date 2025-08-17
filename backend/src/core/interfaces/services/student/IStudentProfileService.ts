// src/core/interfaces/services/student/IStudentProfileService.ts

import { IStudent } from '@/models/Student';

export interface IStudentProfileService {
  getProfile(studentId: string): Promise<IStudent>;
  updateStudentProfile(studentId: string, data: Partial<IStudent>): Promise<IStudent>;
}
