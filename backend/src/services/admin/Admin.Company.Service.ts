import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IAdminCompanyService } from "../../core/interfaces/services/admin/IAdminCompanyService";
import { ICompanyRepository } from "../../core/interfaces/repositories/company/ICompanyRepository";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import { adminCompanyDto, IAdminCompanyDto } from "../../core/dtos/admin/Admin.company.Dto";

@injectable()
export class AdminCompanyService implements IAdminCompanyService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly _companyRepo: ICompanyRepository
  ) { }

  async getAllCompanies(page: number, limit: number, search: string):
    Promise<{ companies: IAdminCompanyDto[]; total: number; totalPages: number }> {
    const companies = await this._companyRepo.getAllCompanies(page, limit, search);
    const total = await this._companyRepo.countCompanies(search);
    const totalPages = Math.ceil(total / limit);

    return { companies: companies.map(adminCompanyDto), total, totalPages };
  }

  async getUnverifiedCompanies(
    page: number,
    limit: number,
    search: string
  ): Promise<{ companies: IAdminCompanyDto[]; total: number; totalPages: number }> {
    const companies = await this._companyRepo.getUnverifiedCompanies(page, limit, search);
    const total = await this._companyRepo.countUnverifiedCompanies(search);
    const totalPages = Math.ceil(total / limit);

    return { companies: companies.map(adminCompanyDto), total, totalPages };
  }

  async getCompanyById(companyId: string): Promise<IAdminCompanyDto> {
    const company = await this._companyRepo.findById(companyId);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(company);
  }

  async verifyCompany(companyId: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.verifyCompany(companyId);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async rejectCompany(companyId: string, reason: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.rejectCompany(companyId, reason);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async blockCompany(companyId: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.blockCompany(companyId);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async unblockCompany(companyId: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.unblockCompany(companyId);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async approveAllCompanies() {
    const updated = await this._companyRepo.approveAll();
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated ;
  }

  async rejectAllCompanies(reason: string) {
    const updated = await this._companyRepo.rejectAll(reason);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated ;
  }
}
