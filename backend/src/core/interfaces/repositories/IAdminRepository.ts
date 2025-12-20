import { IAdmin } from '../../../models/Admin';

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  findById(id: string): Promise<IAdmin | null>;
  update(id: string, updates: Partial<IAdmin>): Promise<IAdmin | null>;
  updatePassword(id: string, hashedPassword: string): Promise<void>;
  create(data: Partial<IAdmin>): Promise<IAdmin>;
  updateEmail(id: string, newEmail: string): Promise<void>;
}


