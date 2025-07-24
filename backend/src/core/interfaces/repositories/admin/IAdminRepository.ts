import { IAdmin } from "../../../../models/Admin";

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
}


