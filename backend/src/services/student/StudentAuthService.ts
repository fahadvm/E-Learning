import { inject, injectable } from "inversify";
import bcrypt from "bcryptjs";

import { IStudentAuthService } from "../../core/interfaces/services/student/IStudentAuthService";
import { IStudentRepository } from "../../core/interfaces/repositories/student/IStudentRepository";
import { IOtpRepository } from "../../core/interfaces/repositories/common/IOtpRepository";
import { IStudent } from "../../models/Student";
import { throwError } from "../../utils/ResANDError";
import { generateAccessToken, generateRefreshToken } from "../../utils/JWTtoken";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { generateOtp, sendOtpEmail } from "../../utils/OtpServices";
import { GooglePayLoad } from "../../types/userTypes";
import { verifyGoogleIdToken } from "../../utils/googleVerify"; 

@injectable()
export class StudentAuthService implements IStudentAuthService {
  constructor(
    @inject("StudentRepository") private studentRepo: IStudentRepository,
    @inject("OtpRepository") private otpRepository: IOtpRepository
  ) {}

  async sendOtp(data: IStudent): Promise<void> {
    const { email, password, name } = data;

    if (!email || !password || !name) {
      throwError("All fields are required", STATUS_CODES.BAD_REQUEST);
    }

    const existingStudent = await this.studentRepo.findByEmail(email);
    if (existingStudent) {
      throwError("Student already exists", STATUS_CODES.CONFLICT);
    }

    const existingOtp = await this.otpRepository.findByEmail(email);
    if (existingOtp) {
      throwError("OTP already sent. Please wait.", STATUS_CODES.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepository.create({
      email,
      otp,
      expiresAt,
      purpose: "signup",
      tempUserData: {
        name,
        password: hashedPassword,
      },
    });

    await sendOtpEmail(email, otp);
  }

  async resendOtp(email: string, purpose: "signup" | "forgot-password"): Promise<void> {
    const existing = await this.otpRepository.findByEmail(email);
    if (!existing) throwError("No OTP record found", STATUS_CODES.NOT_FOUND);
    if (existing.purpose !== purpose) throwError("OTP purpose mismatch", STATUS_CODES.BAD_REQUEST);

    const newOtp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepository.updateOtp(email, newOtp, expiresAt);
    await sendOtpEmail(email, newOtp);
  }

  async verifyOtp(email: string, otp: string): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    };
  }> {
    const record = await this.otpRepository.findByEmail(email);
    if (!record) throwError("OTP not found or expired");

    const now = new Date();
    if (record.otp !== otp || record.expiresAt < now) {
      throwError("Invalid or expired OTP");
    }

    if (!record.tempUserData) {
      throwError("Temporary user data missing");
    }

    const { name, password } = record.tempUserData;

    const student = await this.studentRepo.create({
      name,
      email,
      password,
      isVerified: true,
      isBlocked: false,
    });

    await this.otpRepository.deleteByEmail(email);

    const token = generateAccessToken(student.id, "student");
    const refreshToken = generateRefreshToken(student.id, "student");

    return {
      token,
      refreshToken,
      user: {
        id: student.id,
        role: "student",
        email: student.email,
        name: student.name,
      },
    };
  }

  async login(email: string, password: string): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      role: string;
      email: string;
      name: string;
    };
  }> {
    const student = await this.studentRepo.findByEmail(email);
    if (!student) throwError("Invalid credentials", STATUS_CODES.BAD_REQUEST);

    if (student.password) {
      const match = await bcrypt.compare(password, student.password);
      if (!match) throwError("Invalid credentials", STATUS_CODES.BAD_REQUEST);
    }

    if (!student.isVerified) throwError("Please verify your email", STATUS_CODES.UNAUTHORIZED);
    if (student.isBlocked) throwError("Account is blocked", STATUS_CODES.FORBIDDEN);

    const token = generateAccessToken(student.id, "student");
    const refreshToken = generateRefreshToken(student.id, "student");

    return {
      token,
      refreshToken,
      user: {
        id: student.id,
        role: "student",
        email: student.email,
        name: student.name,
      },
    };
  }

  async googleAuth(profile: GooglePayLoad): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      role: string;
    };
  }> {
    if (!profile.email || !profile.googleId) {
      throwError("Invalid profile data", STATUS_CODES.BAD_REQUEST);
    }

    let user = await this.studentRepo.findOne({ email: profile.email });

    if (!user) {
      user = await this.studentRepo.create({
        name: profile.username,
        email: profile.email,
        googleId: profile.googleId,
        profilePicture: profile.image,
        role: "student",
        googleUser: true,
        isVerified: true,
      });
    } else if (!user.googleUser) {
      user = await this.studentRepo.update(user.id, {
        name: profile.username,
        email: profile.email,
        googleId: profile.googleId,
        role: "student",
        googleUser: true,
        isVerified: true,
      });
    }

    if (user.isBlocked) throwError("User is blocked", STATUS_CODES.FORBIDDEN);

    const token = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }

  async handleGoogleSignup(idToken: string): Promise<{
    user: { id: string; role: string };
    token: string;
  }> {
    const profile = await verifyGoogleIdToken(idToken); 
    const { token, user } = await this.googleAuth(profile);
    return { user, token };
  }

  async sendForgotPasswordOtp(email: string): Promise<void> {
    const student = await this.studentRepo.findByEmail(email);
    if (!student) throwError("Student not found", STATUS_CODES.NOT_FOUND);

    const existingOtp = await this.otpRepository.findByEmail(email);
    if (existingOtp) throwError("OTP already sent", STATUS_CODES.BAD_REQUEST);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepository.create({
      email,
      otp,
      expiresAt,
      purpose: "forgot-password",
    });

    await sendOtpEmail(email, otp);
  }

  async verifyForgotOtp(email: string, otp: string): Promise<void> {
    const record = await this.otpRepository.findByEmail(email);
    if (!record || record.purpose !== "forgot-password") {
      throwError("OTP not found", STATUS_CODES.BAD_REQUEST);
    }

    if (record.otp !== otp || record.expiresAt < new Date()) {
      throwError("Invalid or expired OTP", STATUS_CODES.UNAUTHORIZED);
    }
  }

  async setNewPassword(email: string, newPassword: string): Promise<void> {
    const student = await this.studentRepo.findByEmail(email);
    if (!student) throwError("Student not found", STATUS_CODES.NOT_FOUND);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.studentRepo.updateByEmail(email, { password: hashedPassword });
    await this.otpRepository.deleteByEmail(email);
  }
}
