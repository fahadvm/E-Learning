export interface IOtpRepository {
  create(data: {
    email: string;
    otp: string;
    expiresAt: Date;
    purpose?: string; // e.g., "signup", "forgot-password"
    tempUserData?: {
      name: string;
      password: string;
    };
  }): Promise<void>;

  findByEmail(
    email: string,
    purpose?: string
  ): Promise<{
    email: string;
    otp: string;
    expiresAt: Date;
    purpose?: string;
    tempUserData?: {
      name: string;
      password: string;
    };
  } | null>;

  deleteByEmail(email: string, purpose?: string): Promise<void>;

   updateOtp(
    email: string,
    otp: string,
    expiresAt: Date,
    purpose?: 'signup' | 'forgot-password '|'change-email' ,
    tempUserData?: {
      name: string;
      password: string;
    }
  ): Promise<void>;
}
