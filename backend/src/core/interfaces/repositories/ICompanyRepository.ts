import { ICompany } from '../../../models/Company';

export interface ICompanyRepository {
  findByEmail(email: string): Promise<ICompany | null>;
  create(data: { name: string; email: string; password: string ,companyCode:string }): Promise<ICompany>;
  updatePassword(email: string, newPassword: string): Promise<void>;

  findAll(): Promise<ICompany[]>;
  findById(id: string): Promise<ICompany | null>;
  updateById(id: string, data: Partial<ICompany>): Promise<ICompany | null>;

  getAllCompanies(page: number, limit: number, search: string): Promise<ICompany[]>;
  countCompanies(search: string): Promise<number>;
  getUnverifiedCompanies(page: number, limit: number, search: string): Promise<ICompany[]>;
  countUnverifiedCompanies(search: string): Promise<number>;


  verifyCompany(companyId: string): Promise<ICompany | null>;
  rejectCompany(companyId: string, reason: string): Promise<ICompany | null>;
  approveAll(): Promise<{ modifiedCount: number }>;
  rejectAll(reason: string): Promise<{ modifiedCount: number }>;

  blockCompany(companyId: string): Promise<ICompany | null>;
  unblockCompany(companyId: string): Promise<ICompany | null>;
 findByCompanyCode(code: string): Promise<ICompany | null> 

}
