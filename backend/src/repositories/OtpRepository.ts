import { IOtpRepository } from '../core/interfaces/repositories/admin/IOtpRepository';
import { Otp, IOtp } from '../models/Otp';
import { OtpPurpose, OtpQuery } from '../types/filter/fiterTypes';




export class OtpRepository implements IOtpRepository {
  async create(data: {
    email: string;
    otp: string;
    expiresAt: Date;
    purpose?: OtpPurpose;
    tempUserData?: {
      name: string;
      password: string;
    };
  }): Promise<void> {
    await Otp.create(data);
  }

  async findByEmail(email: string, purpose?: OtpPurpose): Promise<IOtp | null> {
    const now = new Date();
    const query: OtpQuery = {
      email,
      expiresAt: { $gt: now },
    };
    if (purpose) query.purpose = purpose;

    return await Otp.findOne(query).lean();
  }

  async deleteByEmail(email: string, purpose?: OtpPurpose): Promise<void> {
    const query: OtpQuery = { email };
    if (purpose) query.purpose = purpose;

    await Otp.deleteOne(query);
  }

  async updateOtp(
    email: string,
    otp: string,
    expiresAt: Date,
    purpose?: OtpPurpose,
    tempUserData?: {
      name: string;
      password: string;
    }
  ): Promise<void> {
    const query: OtpQuery = { email };
    if (purpose) query.purpose = purpose;

    await Otp.updateOne(query, {
      $set: {
        otp,
        expiresAt,
        ...(tempUserData && { tempUserData }),
      },
    });
  }
}
