// src/core/interfaces/services/employee/IEmployeeProfileService.ts

import { IEmployee } from '../../../../models/Employee';
import {  IEmployeeProfileDTO } from '../../../dtos/employee/student.profile.dto';


export interface IEmployeeProfileService {
  getProfile(employeeId: string): Promise<IEmployeeProfileDTO>;
  updateEmployeeProfile(employeeId: string, data: Partial<IEmployee>): Promise<IEmployeeProfileDTO>;
}
