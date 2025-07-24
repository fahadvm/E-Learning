import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";

import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { IAdminRepository } from "../../core/interfaces/repositories/admin/IAdminRepository";
import { IStudentRepository } from "../../core/interfaces/repositories/student/IStudentRepository";
import { ICompanyRepository } from "../../core/interfaces/repositories/company/ICompanyRepository";

import { throwError } from "../../utils/ResANDError";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject("AdminRepository") private adminRepo: IAdminRepository,
    @inject("StudentRepository") private studentRepo: IStudentRepository,
    @inject("CompanyRepository") private companyRepo: ICompanyRepository
  ) { }

 async login(email: string, password: string) {
  const admin = await this.adminRepo.findByEmail(email);
  if (!admin) {
    throwError("Invalid credentials", STATUS_CODES.UNAUTHORIZED);
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    throwError("Invalid credentials", STATUS_CODES.UNAUTHORIZED);
  }

  const token = generateAccessToken(admin.id, "admin");
  const refreshToken = generateRefreshToken(admin.id, "admin");

  return {
    token,
    refreshToken,
    admin: {
      id: admin.id.toString(), 
      email: admin.email,
      role: "admin",
    },
  };
}

  async getAllUsers() {
    
    return this.studentRepo.findAll();
  }

  async getAllCompanies() {
    return this.companyRepo.findAll();
  }
}
