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
exports.sendOtpEmail = void 0;
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
    logger_1.default.info('otp is :', otp);
    yield transporter.sendMail(mailOptions);
});
exports.sendOtpEmail = sendOtpEmail;
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
