import { injectable } from "inversify";
import { IAdminRepository } from "../../core/interfaces/repositories/admin/IAdminRepository";
import { IAdmin, AdminModel } from "../../models/Admin";

@injectable()
export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return AdminModel.findOne({ email });
  }
}
