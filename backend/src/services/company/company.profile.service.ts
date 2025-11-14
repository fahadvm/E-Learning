import { inject, injectable } from 'inversify';
import { ICompanyProfileService } from '../../core/interfaces/services/company/ICompanyProfileService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { ICompany } from '../../models/Company';
import { MESSAGES } from '../../utils/ResponseMessages';

import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import cloudinary from '../../config/cloudinary';



@injectable()
export class CompanyProfileService implements ICompanyProfileService {
  constructor(
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
  ) { }

  // Helper for Cloudinary upload
  private async uploadToCloudinary(file: Express.Multer.File, folder: string, resourceType: 'video' | 'image' | 'raw' | 'auto' = 'auto'): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: resourceType, folder }, (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else resolve(result.secure_url);
      }).end(file.buffer);
    });
  }


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


  async requestVerification(
    companyId: string,
    name: string,
    address: string,
    pincode: string,
    phone: string,
    certificateFile: Express.Multer.File,
    taxIdFile: Express.Multer.File
  ) {
    const existing = await this._companyRepository.findById(companyId);

    if (!existing) {
      throwError("Company not found", STATUS_CODES.NOT_FOUND);
    }

    if (existing.status === "pending") {
      throwError("Verification already submitted", STATUS_CODES.BAD_REQUEST);
    }

    // Upload to cloudinary

    const certificateUrl = await this.uploadToCloudinary(certificateFile, "company/certificates");
    const taxIdUrl = await this.uploadToCloudinary(taxIdFile, "company/taxIds");


    const updateData = {
      name,
      address,
      pincode,
      phone,
      status: "pending",
      isVerified: false,
      registrationDocs: {
        certificate: certificateUrl,
        taxId: taxIdUrl
      }
    };
    const updated = await this._companyRepository.updateById(companyId, updateData);

    return updated;
  }


}



