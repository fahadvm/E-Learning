import { ICompany } from "../../../../models/Company";

export interface ICompanyRepository {
  findByEmail(email: string): Promise<ICompany | null>;
  create(data: { name: string; email: string; password: string }): Promise<ICompany>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  findAll(): Promise<ICompany[]>;
}
