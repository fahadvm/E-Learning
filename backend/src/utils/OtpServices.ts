import nodemailer from 'nodemailer';
import { TemporaryCompanyData } from '../types/filter/fiterTypes';
import logger from './logger';
const otpStore = new Map<string, TemporaryCompanyData>();

export function generateOtp(length: number = 6): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10); // random digit 0–9
  }
  return otp;
}


export const sendOtpEmail = async (toEmail: string, otp: string): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DevNext" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Your DevNext OTP Code',
    html: `<h3>Your OTP code is: <b>${otp}</b></h3><p>It is valid for 1 minutes.</p>`,
  };

  logger.debug(`otp is : ${otp}`);

  await transporter.sendMail(mailOptions);
};



export async function storeTemporaryCompanyData(email: string,data: Omit<TemporaryCompanyData, 'createdAt'>) {
  otpStore.set(email, { ...data, createdAt: Date.now() });
}

export function getTemporaryCompanyData(email: string) {
  return otpStore.get(email);
}

export function clearTemporaryCompanyData(email: string) {
  otpStore.delete(email);
}


