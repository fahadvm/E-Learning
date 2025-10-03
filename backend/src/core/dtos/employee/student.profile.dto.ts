// src/core/dto/employee/employeeProfileDto.ts
import { IEmployee } from '../../../models/Employee';

export const employeeProfileDto = (employee: IEmployee): IEmployeeProfileDTO => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  about: employee.about,
  phone: employee.phone,
  profilePicture: employee.profilePicture,
  role: employee.role,
  isVerified: employee.isVerified,
  isBlocked: employee.isBlocked,
  social_links: employee.social_links,
  position : employee.position
});

export interface IEmployeeProfileDTO {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isBlocked: boolean;
  role: string;
  profilePicture?: string;
  about?: string;
  phone?: string;
  position?:string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}
