// src/core/interfaces/services/student/IStudentProfileService.ts

import { IStudent } from '../../../../models/Student';
import {  IStudentProfileDTO } from '../../../../core/dtos/student/Student.profile.Dto';
import { IContribution } from '../../../../types/common/contribution';


export interface IStudentProfileService {
  getProfile(studentId: string): Promise<IStudentProfileDTO>;
  updateStudentProfile(studentId: string, data: Partial<IStudent>): Promise<IStudentProfileDTO>;
 getContributions(leetcodeUsername: string , githubUsername:string): Promise<IContribution>;
}
