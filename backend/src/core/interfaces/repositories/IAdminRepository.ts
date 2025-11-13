import { IAdmin } from '../../../models/Admin';

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findById(id: string): Promise<IAdmin | null>;
  update(id: string, updates: Partial<IAdmin>): Promise<IAdmin | null>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
}


