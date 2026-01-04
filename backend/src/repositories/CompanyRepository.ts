import { injectable } from 'inversify';
import { ICompanyRepository } from '../core/interfaces/repositories/ICompanyRepository';
import { ICompany, Company } from '../models/Company';
import { FilterQuery, UpdateQuery } from 'mongoose';

@injectable()
export class CompanyRepository implements ICompanyRepository {
  async findByEmail(email: string): Promise<ICompany | null> {
    return Company.findOne({ email }).exec();
  }

  async create(data: { name: string; email: string; password: string, companyCode: string }): Promise<ICompany> {
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
    return Company.findById(id)
      .populate({
        path: 'employees',
        select: 'name email position isBlocked _id coursesAssigned',
      })
      .exec();
  }

  async updateById(id: string, data: Partial<ICompany>): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(id, data as UpdateQuery<ICompany>, { new: true }).exec();
  }

  async getAllCompanies(page: number, limit: number, search: string): Promise<ICompany[]> {
    const query: FilterQuery<ICompany> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return Company.find(query)
      .populate({
        path: 'employees',
        select: 'name email',
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async countCompanies(search: string): Promise<number> {
    const query: FilterQuery<ICompany> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return Company.countDocuments(query).exec();
  }

  async countUnverifiedCompanies(search: string): Promise<number> {
    const query: FilterQuery<ICompany> = {
      isVerified: false,
      status: 'pending',
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    return Company.countDocuments(query).exec();
  }

  async getUnverifiedCompanies(page: number, limit: number, search: string): Promise<ICompany[]> {
    const query: FilterQuery<ICompany> = {
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
      { isVerified: true, status: 'verified' } as UpdateQuery<ICompany>,
      { new: true }
    ).exec();
  }

  async rejectCompany(companyId: string, reason: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { status: 'rejected', rejectReason: reason } as UpdateQuery<ICompany>,
      { new: true }
    ).exec();
  }

  async blockCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { isBlocked: true } as UpdateQuery<ICompany>,
      { new: true }
    ).exec();
  }

  async unblockCompany(companyId: string): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(
      companyId,
      { isBlocked: false } as UpdateQuery<ICompany>,
      { new: true }
    ).exec();
  }

  async approveAll(): Promise<{ modifiedCount: number }> {
    const result = await Company.updateMany(
      { status: 'pending', isVerified: false },
      { $set: { status: 'verified', isVerified: true, rejectionReason: null } } as UpdateQuery<ICompany>
    ).exec();
    return { modifiedCount: result.modifiedCount };
  }

  async rejectAll(reason: string): Promise<{ modifiedCount: number }> {
    const result = await Company.updateMany(
      { status: 'pending', isVerified: false },
      { $set: { status: 'rejected', isVerified: false, rejectReason: reason } } as UpdateQuery<ICompany>
    ).exec();
    return { modifiedCount: result.modifiedCount };
  }

  async findByCompanyCode(code: string): Promise<ICompany | null> {
    return Company.findOne({ companyCode: code }).exec();
  }

  async addEmployee(companyId: string, employeeId: string): Promise<void> {
    await Company.findByIdAndUpdate(companyId, {
      $addToSet: { employees: employeeId }
    }).exec();
  }

  async removeEmployee(companyId: string, employeeId: string): Promise<void> {
    await Company.findByIdAndUpdate(companyId, {
      $pull: { employees: employeeId }
    }).exec();
  }
}
