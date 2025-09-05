// repositories/student/StudentRepository.ts
import { injectable } from 'inversify';
import { Admin, IAdmin } from '../models/Admin';
import { IAdminRepository } from '../core/interfaces/repositories/IAdminRepository';

@injectable()
export class AdminRepository implements IAdminRepository {

  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).lean().exec();
  }

  async findById(id: string): Promise<IAdmin | null> {
    return Admin.findById(id).lean().exec();
  }

}
