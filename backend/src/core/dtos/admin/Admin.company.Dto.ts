import { ICompany } from "../../../models/Company";

export interface IAdminCompanyDto {
  _id: string;
  name: string;
  email: string;
  status: string;
  rejectReason?: string;
  isPremium: boolean;
  isVerified: boolean;
  employees: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const adminCompanyDto = (company: ICompany): IAdminCompanyDto => ({
  _id: company._id.toString(),
  name: company.name,
  email: company.email,
  status: company.status,
  rejectReason: company.rejectReason,
  isPremium: company.isPremium,
  isVerified: company.isVerified,
  employees: company.employees?.map(empId => empId.toString()) || [],
  createdAt: company.createdAt,
  updatedAt: company.updatedAt,
});
