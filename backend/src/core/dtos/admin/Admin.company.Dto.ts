import { IEmployee } from '../../../models/Employee';
import { ICompany } from '../../../models/Company';

export interface IAdminCompanyEmployeeDto {
  _id: string;
  name: string;
  email: string;
  position?: string;
}

export interface IAdminCompanyDto {
  _id: string;
  name: string;
  email: string;
  phone: string | null;
  about: string | null;
  website: string | null;
  profilePicture: string | null;
  status: string;
  rejectReason?: string;
  isPremium: boolean;
  isVerified: boolean;
  employees: IAdminCompanyEmployeeDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdminCompanyDetailsDto {
  company: IAdminCompanyDto;
  employees: IAdminCompanyEmployeeDto[];
}

export const adminCompanyDto = (company: ICompany): IAdminCompanyDto => ({
  _id: company._id.toString(),
  name: company.name,
  email: company.email,
  about: company.about || null,
  phone: company.phone || null,
  website: company.website || null,
  profilePicture: company.profilePicture || null,
  status: company.status,
  rejectReason: company.rejectReason,
  isPremium: company.isPremium,
  isVerified: company.isVerified,
  employees:
    (company.employees as unknown as IEmployee[])?.map((emp) => ({
      _id: emp._id.toString(),
      name: emp.name,
      email: emp.email,
      position: emp.position,
    })) || [],
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
});

export const adminCompanyEmployeeDto = (
  employee: IEmployee
): IAdminCompanyEmployeeDto => ({
  _id: employee._id.toString(),
  name: employee.name,
  email: employee.email,
  position: employee.position,
});
