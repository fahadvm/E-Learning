import { ICompany } from '../../../../models/Company';

export interface ICompanyProfileService {
  getProfile(id: string): Promise<ICompany | null>;
  updateProfile(id: string, data: Partial<ICompany>): Promise<ICompany | null>;
}
