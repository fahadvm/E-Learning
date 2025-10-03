import { inject, injectable } from 'inversify';
import { ICompanyAuthService } from '../../core/interfaces/services/company/ICompanyAuthService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { IOtpRepository } from '../../core/interfaces/repositories/admin/IOtpRepository';
import { ICompany } from '../../models/Company';
import bcrypt from 'bcryptjs';
import { generateOtp, sendOtpEmail } from '../../utils/OtpServices';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { customAlphabet } from "nanoid";


  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);

@injectable()
export class CompanyAuthService implements ICompanyAuthService {
  constructor(
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
    @inject(TYPES.OtpRepository) private readonly _otpRepository: IOtpRepository
  ) { }


  async sendOtp(data: { name: string; email: string; password: string }): Promise<void> {
    const { name, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const purpose: 'signup' = 'signup';
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    let tempUserData = { name, password };
    const existingOtp = await this._companyRepository.findByEmail(email);
    if (existingOtp) await this._otpRepository.updateOtp(email, otp, expiresAt, purpose, tempUserData);


    await this._otpRepository.create({
      email,
      otp,
      expiresAt,
      tempUserData: { name, password: hashedPassword },
    });


    await sendOtpEmail(email, otp);
  }



  async verifyOtp(email: string, otp: string): Promise<ICompany> {
    const tempData = await this._otpRepository.findByEmail(email);
    if (!tempData) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (tempData.otp !== otp || tempData.expiresAt < new Date()) {
      await this._otpRepository.deleteByEmail(email);
      throwError(MESSAGES.OTP_INVALID, STATUS_CODES.UNAUTHORIZED);
    }

    const existingCompany = await this._companyRepository.findByEmail(email);
    if (existingCompany) throwError(MESSAGES.VERIFIED, STATUS_CODES.CONFLICT);

    let companyCode = nanoid();
    while (await this._companyRepository.findByCompanyCode(companyCode)) {
      companyCode = nanoid();
    }

    const newCompany = await this._companyRepository.create({
      email: tempData.email,
      name: tempData.tempUserData?.name ?? "",
      password: tempData.tempUserData?.password ?? "",
      companyCode, 
    });

    await this._otpRepository.deleteByEmail(email);

    return newCompany;
  }


  async login(email: string, password: string) {
    const company = await this._companyRepository.findByEmail(email);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    const companyId = company.id.toString();

    const token = generateAccessToken(companyId, 'company');
    const refreshToken = generateRefreshToken(companyId, 'company');

    return { token, refreshToken, company: { id: companyId, name: company.name, email: company.email } };
  }

  async forgotPassword(email: string): Promise<void> {
    const company = await this._companyRepository.findByEmail(email);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepository.create({ email, otp, expiresAt, purpose: 'forgot-password' });
    await sendOtpEmail(email, otp);
  }

  async verifyForgotOtp(email: string, otp: string): Promise<void> {
    const tempData = await this._otpRepository.findByEmail(email, 'forgot-password');
    if (!tempData || tempData.otp !== otp) throwError(MESSAGES.OTP_EXPIRED, STATUS_CODES.UNAUTHORIZED);

    if (tempData.expiresAt < new Date()) {
      await this._otpRepository.deleteByEmail(email, 'forgot-password');
      throwError(MESSAGES.OTP_EXPIRED, STATUS_CODES.GONE);
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const company = await this._companyRepository.findByEmail(email);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const hashed = await bcrypt.hash(newPassword, 10);
    await this._companyRepository.updatePassword(email, hashed);
    await this._otpRepository.deleteByEmail(email, 'forgot-password');
  }

  async resendForgotPasswordOtp(email: string): Promise<void> {
    const company = await this._companyRepository.findByEmail(email);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this._otpRepository.updateOtp(email, otp, expiresAt, 'forgot-password');
    await sendOtpEmail(email, otp);
  }

}
