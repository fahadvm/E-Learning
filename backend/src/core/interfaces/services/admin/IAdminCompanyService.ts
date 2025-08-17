import { IAdminCompanyDto } from "../../../../core/dtos/admin/Admin.company.Dto";

export interface IAdminCompanyService {
    getAllCompanies(page: number, limit: number, search: string): Promise<{ companies: IAdminCompanyDto[], total: number, totalPages: number }>;
    getUnverifiedCompanies(page: number, limit: number, search: string): Promise<{ companies: IAdminCompanyDto[], total: number, totalPages: number }>;
    getCompanyById(companyId: string): Promise<IAdminCompanyDto>;
    verifyCompany(companyId: string): Promise<IAdminCompanyDto>;
    rejectCompany(companyId: string, reason: string): Promise<IAdminCompanyDto>;
    blockCompany(companyId: string): Promise<IAdminCompanyDto>;
    unblockCompany(companyId: string): Promise<IAdminCompanyDto>;
    approveAllCompanies(): Promise<{ modifiedCount: number }>;
    rejectAllCompanies(reason: string): Promise<{ modifiedCount: number }>;
}
