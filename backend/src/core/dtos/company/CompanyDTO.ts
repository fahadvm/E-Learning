// src/core/dto/company/companyProfileDto.ts
import { ICompany } from '../../../models/Company';

export const companyProfileDto = (company: ICompany) => ({
  _id: company._id.toString(),
  name: company.name,
  email: company.email,
  status: company.status,
  rejectReason: company.rejectReason,
  employees: company.employees?.map(empId => empId.toString()) || [],
  isPremium: company.isPremium,
  isVerified: company.isVerified,

});
