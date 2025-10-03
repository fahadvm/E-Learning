import { IEmployee } from '../../../models/Employee';

export interface ICompanyEmployeeDTO {
  _id: string;
  name: string;
  email: string;
  companyId: string;
  coursesAssigned: string[];
  position?: string;
  isBlocked: boolean;
  subscription: boolean;
}

export interface PaginatedEmployeeDTO {
  employees: ICompanyEmployeeDTO[];
  total: number;
  totalPages: number;
}


export const companyEmployeeDto = (employee: IEmployee): ICompanyEmployeeDTO => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  companyId: employee.companyId.toString(),
  coursesAssigned: employee.coursesAssigned?.map(id => id.toString()) || [],
  position: employee.position,
  isBlocked: employee.isBlocked,
  subscription: employee.subscription,
});
