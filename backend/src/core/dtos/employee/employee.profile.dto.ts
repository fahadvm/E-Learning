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
  position: employee.position,
  streakCount: employee.streakCount,
  lastLoginDate: employee.lastLoginDate,
  longestStreak: employee.longestStreak,
  companyId: employee.companyId?.toString(),
  requestedCompanyId: employee.requestedCompanyId?.toString(),
  coursesAssigned: employee.coursesAssigned?.map((id) => id.toString()) ?? [],
  status: employee.status,
  subscription: employee.subscription,
});

export interface IEmployeeProfileDTO {
  _id: string;
  name: string;
  email: string;
  companyId?: string;
  requestedCompanyId?: string;
  password?: string;
  profilePicture?: string;
  coursesAssigned: string[];
  position?: string;
  isBlocked: boolean;
  status: string;
  role: string;
  isVerified: boolean;
  subscription: boolean;
  googleId?: string;
  about?: string;
  phone?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  streakCount: number
  lastLoginDate: Date
  longestStreak: number

}
