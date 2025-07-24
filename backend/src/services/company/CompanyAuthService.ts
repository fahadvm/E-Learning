import { inject, injectable } from "inversify";
import { ICompanyAuthService } from "../../core/interfaces/services/company/ICompanyAuthService";
import { ICompanyRepository } from "../../core/interfaces/repositories/company/ICompanyRepository";
import { IOtpRepository } from "../../core/interfaces/repositories/common/IOtpRepository";

import bcrypt from "bcryptjs";
import { generateOtp, sendOtpEmail, } from "../../utils/OtpServices";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";

@injectable()
export class CompanyAuthService implements ICompanyAuthService {
    constructor(
        @inject("CompanyRepository") private companyRepository: ICompanyRepository,
        @inject("OtpRepository") private otpRepository: IOtpRepository

    ) { }

    async sendOtp(data: { name: string; email: string; password: string }): Promise<void> {
        console.log("data in send otp")
        const { name, email, password } = data;

        const existing = await this.companyRepository.findByEmail(email);
        if (existing) {
            throwError("Company already exists", STATUS_CODES.CONFLICT);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);


        await this.otpRepository.create({
            email,
            otp,
            expiresAt,
            tempUserData: {
                name,
                password: hashedPassword,
            },
        });

        await sendOtpEmail(email, otp);
    }

    async verifyOtp(email: string, otp: string): Promise<any> {
        console.log("email", email)
        const tempData = await this.otpRepository.findByEmail(email);
        console.log("tempData", tempData);

        if (!tempData) {
            throwError("No signup request found", STATUS_CODES.NOT_FOUND);
        }

        if (tempData.otp !== otp) {
            console.log('otps:', tempData.otp, otp)
            throwError("Invalid OTP", STATUS_CODES.UNAUTHORIZED);
        }

        if (tempData.otp !== otp) {
            throwError("Invalid or expired OTP", STATUS_CODES.UNAUTHORIZED);
        }
        const now = new Date();
        if (tempData.expiresAt < now) {
            await this.otpRepository.deleteByEmail(email);
            throwError("OTP expired", STATUS_CODES.GONE);
        }

        const existingCompany = await this.companyRepository.findByEmail(email);
        if (existingCompany) {
            throwError("Company already verified", STATUS_CODES.CONFLICT);
        }

        const newCompany = await this.companyRepository.create({
            email: tempData.email,
            name: tempData.tempUserData?.name ?? "",         
            password: tempData.tempUserData?.password ?? "", 
        });


        await this.otpRepository.deleteByEmail(email);
        return newCompany;
    }


    async login(email: string, password: string) {
        const company = await this.companyRepository.findByEmail(email);
        if (!company) {
            throwError("Company not found", STATUS_CODES.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            throwError("Invalid credentials", STATUS_CODES.UNAUTHORIZED);
        }
        const token = generateAccessToken(company.id, "company");
        const refreshToken = generateRefreshToken(company.id, "company");




        return {
            token,
            refreshToken,
            company: {
                id: company.id,
                name: company.name,
                email: company.email,
            },
        };
    }

    async forgotPassword(email: string): Promise<void> {
        const company = await this.companyRepository.findByEmail(email);
        if (!company) throwError("Company not found", STATUS_CODES.NOT_FOUND);

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this.otpRepository.create({
            email,
            otp,
            expiresAt,
            purpose: "forgot-password"
        });

        await sendOtpEmail(email, otp);
    }

    async resetPassword(email: string,  newPassword: string): Promise<void> {
        const tempData = await this.otpRepository.findByEmail(email, "forgot-password");

        // if (!tempData || tempData.otp !== otp) {
        //     throwError("Invalid or expired OTP", STATUS_CODES.UNAUTHORIZED);
        // }

        // if (tempData.expiresAt < new Date()) {
        //     await this.otpRepository.deleteByEmail(email, "forgot-password");
        //     throwError("OTP expired", STATUS_CODES.GONE);
        // }

        const company = await this.companyRepository.findByEmail(email);
        if (!company) {
            throwError("Company not found", STATUS_CODES.NOT_FOUND);
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await this.companyRepository.updatePassword(email, hashed);

        await this.otpRepository.deleteByEmail(email, "forgot-password");
    }

    async verifyForgotOtp(email: string, otp: string): Promise<void> {
        const tempData = await this.otpRepository.findByEmail(email, "forgot-password");

        if (!tempData || tempData.otp !== otp) {
            throwError("Invalid OTP", STATUS_CODES.UNAUTHORIZED);
        }

        if (tempData.expiresAt < new Date()) {
            await this.otpRepository.deleteByEmail(email, "forgot-password");
            throwError("OTP expired", STATUS_CODES.GONE);
        }

    }

    async resendForgotPasswordOtp(email: string): Promise<void> {
        const company = await this.companyRepository.findByEmail(email);
        if (!company) throwError("Company not found", STATUS_CODES.NOT_FOUND);

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this.otpRepository.updateOtp(email, otp, expiresAt, "forgot-password");
        await sendOtpEmail(email, otp);
    }


}
