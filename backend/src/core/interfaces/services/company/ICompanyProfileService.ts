import { ICompany } from '../../../../models/Company';

export interface ICompanyProfileService {
  getProfile(id: string): Promise<ICompany | null>;
  updateProfile(id: string, data: Partial<ICompany>): Promise<ICompany | null>;
  requestVerification(
    companyId: string,
    name: string,
    address: string,
    pincode: string,
    phone: string,
    certificateFile: Express.Multer.File,
    taxIdFile: Express.Multer.File
  ): Promise<any>;
}
