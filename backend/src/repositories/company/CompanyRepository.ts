import { injectable } from "inversify";
import { ICompanyRepository } from "../../core/interfaces/repositories/company/ICompanyRepository";
import { ICompany, Company } from "../../models/Company";

@injectable()
export class CompanyRepository implements ICompanyRepository {
  async findByEmail(email: string): Promise<ICompany | null> {
    return Company.findOne({ email });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ICompany> {
    return Company.create(data);
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await Company.updateOne({ email }, { password: newPassword });
  }

   async findAll(): Promise<ICompany[]> {
    return Company.find(); 
  }
}
