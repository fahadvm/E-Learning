// src/core/interfaces/services/employee/IEmployeeProfileService.ts

import { IEmployee } from '../../../../models/Employee';
import {  IEmployeeProfileDTO } from '../../../dtos/employee/employee.profile.dto';


export interface IEmployeeProfileService {
  getProfile(employeeId: string): Promise<IEmployee>;
  updateEmployeeProfile(employeeId: string, data: Partial<IEmployee>): Promise<IEmployeeProfileDTO>;
}
