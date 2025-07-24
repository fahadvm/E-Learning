import { IOtpRepository } from "../../core/interfaces/repositories/common/IOtpRepository";
import { Otp, IOtp } from "../../models/Otp";

export class OtpRepository implements IOtpRepository {
  async create(data: {
  email: string;
  otp: string;
  expiresAt: Date;
  purpose?: "signup" | "forgot-password";
  tempUserData?: {
    name: string;
    password: string;
  };
}): Promise<void> {
  await Otp.create(data);
}


  async findByEmail(email: string, purpose?: string) {
    const query: any = { email };
    if (purpose) query.purpose = purpose;
    return await Otp.findOne(query).lean();
  }

  async deleteByEmail(email: string, purpose?: string): Promise<void> {
    const query: any = { email };
    if (purpose) query.purpose = purpose;
    await Otp.deleteOne(query);
  }

  async updateOtp(email: string, otp: string, expiresAt: Date, purpose?: string): Promise<void> {
    const query: any = { email };
    if (purpose) query.purpose = purpose;
    await Otp.updateOne(query, { otp, expiresAt });
  }
}
