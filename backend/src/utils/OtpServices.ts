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
export const sendInvitationLinkEmail = async (toEmail: string, companyName: string, companyCode: string,invitation: string): Promise<void> => {
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
    subject: 'You have an invitation to join DevNext',
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>You're Invited to Join DevNext 🎉</h2>

      <p>
        You have received an invitation from <b>${companyName}</b> to join
        <b>DevNext</b> as an employee.
      </p>

      <p>
        Click the button below to accept your invitation and complete your
        registration:
      </p>

      <a href="${invitation}"
         style="
           display: inline-block;
           padding: 12px 20px;
           background-color: #4f46e5;
           color: #ffffff;
           text-decoration: none;
           border-radius: 6px;
           font-weight: bold;
         ">
        Accept Invitation
      </a>

      <hr style="margin: 24px 0;" />

      <p>
        <b>Company Code:</b>
        <span style="font-size: 16px; color: #111;">
          ${companyCode}
        </span>
      </p>

      <p style="color: #555;">
        After joining, you may be asked to enter this company code to verify
        your association with <b>${companyName}</b>.
      </p>

      <p style="margin-top: 16px; color: #555;">
        This invitation link is valid for <b>24 hours</b>.
        If you did not expect this invitation, you can safely ignore this email.
      </p>

      <p style="margin-top: 24px;">
        — <br />
        The <b>DevNext</b> Team
      </p>
    </div>
  `,
  };


  logger.debug(`otp is : ${invitation}`);

  await transporter.sendMail(mailOptions);
};



export async function storeTemporaryCompanyData(email: string, data: Omit<TemporaryCompanyData, 'createdAt'>) {
  otpStore.set(email, { ...data, createdAt: Date.now() });
}

export function getTemporaryCompanyData(email: string) {
  return otpStore.get(email);
}

export function clearTemporaryCompanyData(email: string) {
  otpStore.delete(email);
}


