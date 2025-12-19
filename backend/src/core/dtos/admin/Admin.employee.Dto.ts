// src/core/dtos/admin/AdminEmployee.dto.ts
import { IEmployee } from '../../../models/Employee';

export interface IAdminEmployeeDTO {
  _id: string;
  name: string;
  email: string;
  companyId?: string;
  companyName?: string;
  coursesAssigned: string[];
  position?: string;
  department?: string;
  isBlocked: boolean;
  subscription: boolean;
  profilePicture?: string;
  createdAt?: Date;
}

export interface PaginatedEmployeeDTO {
  data: IAdminEmployeeDTO[];
  total: number;
  totalPages: number;
}


export const adminEmployeeDto = (employee: any): IAdminEmployeeDTO => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  companyId: employee.companyId?._id?.toString() || employee.companyId?.toString(),
  companyName: employee.companyId?.name,
  coursesAssigned: employee.coursesAssigned?.map((id: any) => id.toString()) || [],
  position: employee.position,
  department: employee.department,
  isBlocked: employee.isBlocked,
  subscription: employee.subscription,
  profilePicture: employee.profilePicture,
  createdAt: employee.createdAt,
});
