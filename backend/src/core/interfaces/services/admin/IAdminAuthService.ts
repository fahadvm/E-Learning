import { IAdmin } from "../../../../models/Admin";
import { IStudent } from "../../../../models/Student"; 
import { ICompany } from "../../../../models/Company";

export interface IAdminAuthService {
  login(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    admin: {
      id: string;
      email: string;
      role: string;
    };
  }>;

  getAllUsers(): Promise<IStudent[]>;
  getAllCompanies(): Promise<ICompany[]>;
}
