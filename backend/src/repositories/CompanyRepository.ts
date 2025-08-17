import { injectable } from 'inversify';
import { ICompanyRepository } from '../core/interfaces/repositories/company/ICompanyRepository';
import { ICompany, Company } from '../models/Company';

@injectable()
export class CompanyRepository implements ICompanyRepository {

  async findByEmail(email: string): Promise<ICompany | null> {
    return Company.findOne({ email }).exec();
  }

  async create(data: { name: string; email: string; password: string }): Promise<ICompany> {
    const company = new Company(data);
    return company.save();
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    await Company.updateOne({ email }, { password: newPassword }).exec();
  }

  async findAll(): Promise<ICompany[]> {
    return Company.find().exec();
  }

  async findById(id: string): Promise<ICompany | null> {
    return Company.findById(id).exec();
  }

  async updateById(id: string, data: Partial<ICompany>): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async getAllCompanies(page: number, limit: number, search: string): Promise<ICompany[]> {
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return Company.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countCompanies(search: string): Promise<number> {
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return Company.countDocuments(query).exec();
  }

  async countUnverifiedCompanies(search: string): Promise<number> {
    const query: any = {
      isVerified: false,
      status: 'pending'
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    return Company.countDocuments(query).exec();
  }

  async getUnverifiedCompanies(page: number, limit: number, search: string): Promise<ICompany[]> {
    const query: any = {
      isVerified: false,
      status: 'pending',
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    return Company.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }


  async verifyCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { isVerified: true, status: 'verified' },
      { new: true }
    ).exec();
  }

  async rejectCompany(companyId: string, reason: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { status: 'rejected', rejectReason: reason },
      { new: true }
    ).exec();
  }

  async blockCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { isBlocked: true },
      { new: true }
    ).exec();
  }

  async unblockCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { isBlocked: false },
      { new: true }
    ).exec();
  }

   async approveAll(): Promise<{ modifiedCount: number }> {
    const result = await Company.updateMany(
      { status: 'pending', isVerified: false },
      { $set: { status: 'verified', isVerified: true, rejectionReason: null } }
    ).exec();
    return { modifiedCount: result.modifiedCount };
  }

  async rejectAll(reason: string): Promise<{ modifiedCount: number }> {
    const result = await Company.updateMany(
      { status: 'pending', isVerified: false },
      { $set: { status: 'rejected', isVerified: false, rejectReason: reason } }
    ).exec();
    return { modifiedCount: result.modifiedCount };
  }
}
