import { inject, injectable } from 'inversify';
import { ICompanyProfileService } from '../../core/interfaces/services/company/ICompanyProfileService';
import { ICompanyRepository } from '../../core/interfaces/repositories/company/ICompanyRepository';
import { ICompany } from '../../models/Company';
import { MESSAGES } from '../../utils/ResponseMessages';

import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';



@injectable()
export class CompanyProfileService implements ICompanyProfileService {
  constructor(
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
  ) {}

  

  async getProfile(id: string): Promise<ICompany> {
    const company = await this._companyRepository.findById(id);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return company;
  }

  async updateProfile(id: string, data: Partial<ICompany>): Promise<ICompany> {
    const updated = await this._companyRepository.updateById(id, data);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }
}
