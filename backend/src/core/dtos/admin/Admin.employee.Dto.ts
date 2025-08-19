// src/core/dtos/admin/AdminEmployee.dto.ts
import { IEmployee } from "../../../models/Employee";

export interface IAdminEmployeeDTO {
  _id: string;
  name: string;
  email: string;
  companyId: string;
  coursesAssigned: string[];
  position?: string;
  blocked: boolean;
  subscription: boolean;
  NoEmployees: number;
}

export interface PaginatedEmployeeDTO {
  data: IAdminEmployeeDTO[];
  total: number;
  totalPages: number;
}


export const adminEmployeeDto = (employee: IEmployee): IAdminEmployeeDTO => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  companyId: employee.companyId.toString(),
  coursesAssigned: employee.coursesAssigned?.map(id => id.toString()) || [],
  position: employee.position,
  blocked: employee.blocked,
  subscription: employee.subscription,
  NoEmployees: employee.NoEmployees,
});
