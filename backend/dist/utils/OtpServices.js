"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvitationLinkEmail = exports.sendOtpEmail = void 0;
exports.generateOtp = generateOtp;
exports.storeTemporaryCompanyData = storeTemporaryCompanyData;
exports.getTemporaryCompanyData = getTemporaryCompanyData;
exports.clearTemporaryCompanyData = clearTemporaryCompanyData;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("./logger"));
const otpStore = new Map();
function generateOtp(length = 6) {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10); // random digit 0–9
    }
    return otp;
}
const sendOtpEmail = (toEmail, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
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
    logger_1.default.debug(`otp is : ${otp}`);
    yield transporter.sendMail(mailOptions);
});
exports.sendOtpEmail = sendOtpEmail;
const sendInvitationLinkEmail = (toEmail, companyName, companyCode, invitation) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
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
    logger_1.default.debug(`otp is : ${invitation}`);
    yield transporter.sendMail(mailOptions);
});
exports.sendInvitationLinkEmail = sendInvitationLinkEmail;
function storeTemporaryCompanyData(email, data) {
    return __awaiter(this, void 0, void 0, function* () {
        otpStore.set(email, Object.assign(Object.assign({}, data), { createdAt: Date.now() }));
    });
}
function getTemporaryCompanyData(email) {
    return otpStore.get(email);
}
function clearTemporaryCompanyData(email) {
    otpStore.delete(email);
}
