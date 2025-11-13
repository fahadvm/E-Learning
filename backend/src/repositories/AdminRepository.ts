// repositories/student/StudentRepository.ts
import { injectable } from 'inversify';
import { Admin, IAdmin } from '../models/Admin';
import { IAdminRepository } from '../core/interfaces/repositories/IAdminRepository';
import { BaseRepository } from './BaseRepository';

@injectable()
export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {

    constructor() {
        super(Admin);
    }

    async update(id: string, updates: Partial<IAdmin>): Promise<IAdmin | null> {
        return Admin.findByIdAndUpdate(id, updates, { new: true }).lean().exec();
    }

    async updatePassword(id: string, hashedPassword: string): Promise<void> {
        await Admin.findByIdAndUpdate(id, { password: hashedPassword }).exec();
    }
}
