import { IEmployee } from '../../../models/Employee';
import { ICompany } from '../../../models/Company';

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


export const adminEmployeeDto = (employee: IEmployee): IAdminEmployeeDTO => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  companyId: (employee.companyId as unknown as ICompany)?._id?.toString() || employee.companyId?.toString(),
  companyName: (employee.companyId as unknown as ICompany)?.name,
  coursesAssigned: employee.coursesAssigned?.map((id) => id.toString()) || [],
  position: employee.position,
  department: employee.department,
  isBlocked: employee.isBlocked,
  subscription: employee.subscription,
  profilePicture: employee.profilePicture,
  createdAt: employee.createdAt,
});
