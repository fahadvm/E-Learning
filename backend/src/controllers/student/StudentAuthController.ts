import { inject, injectable } from "inversify";
import { Request, Response } from "express";

import { IStudentAuthService } from "../../core/interfaces/services/student/IStudentAuthService";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { setTokensInCookies, clearTokens } from "../../utils/JWTtoken";

@injectable()
export class StudentAuthController {
    constructor(
        @inject("StudentAuthService") private studentService: IStudentAuthService
    ) { }

    async signup(req: Request, res: Response) {
        try {
            if (!req.body.email) throwError("Email is required", STATUS_CODES.BAD_REQUEST);
            await this.studentService.sendOtp(req.body);
            sendResponse(res, STATUS_CODES.CREATED, `OTP sent to ${req.body.email}`, true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async verifyOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) throwError("Email and OTP are required", STATUS_CODES.BAD_REQUEST);
            const { token, refreshToken, user } = await this.studentService.verifyOtp(email, otp);
            setTokensInCookies(res, token, refreshToken);
            return sendResponse(res, STATUS_CODES.OK, "OTP verified successfully", true, user);
        } catch (err: any) {
            console.log("res", err.message)
            handleControllerError(res, err);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const { token, refreshToken, user } = await this.studentService.login(email, password);
            setTokensInCookies(res, token, refreshToken);
            return sendResponse(res, STATUS_CODES.OK, "Login successful", true, user);
        } catch (err) {
            handleControllerError(res, err);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            clearTokens(res);
            return sendResponse(res, STATUS_CODES.OK, "Logged out successfully", true);
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async googleAuth(req: Request, res: Response) {
        try {
            if (!req.body) throwError("Request body is missing", STATUS_CODES.BAD_REQUEST);
            const { email, googleId } = req.body;
            if (!email || !googleId) {
                throwError("Missing required Google profile fields", STATUS_CODES.BAD_REQUEST);
            }

            const result = await this.studentService.googleAuth(req.body);
            setTokensInCookies(res, result.token, result.refreshToken);
            res.status(STATUS_CODES.OK).json({
                ok: true,
                msg: "Google authentication successfull",
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            });
        } catch (error) {
            handleControllerError(res, error);
        }
    }

    async sendForgotPasswordOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            console.log("req.body in sendForgotPasswordOtp", req.body)
            if (!email) throwError("Email is required", STATUS_CODES.BAD_REQUEST);
            await this.studentService.sendForgotPasswordOtp(email);
            sendResponse(res, STATUS_CODES.OK, "OTP sent", true);
        } catch (err) {
            handleControllerError(res, err);
        }
    }

    async verifyForgotOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;

            console.log("req.body in verifyForgotOtp ", req.body)
            if (!email || !otp) throwError("Email and OTP are required", STATUS_CODES.BAD_REQUEST);
            await this.studentService.verifyForgotOtp(email, otp);
            sendResponse(res, STATUS_CODES.OK, "OTP verified", true);
        } catch (err) {
            handleControllerError(res, err);
        }
    }

    async setNewPassword(req: Request, res: Response) {
        try {
            const { email, newPassword } = req.body;
            console.log('req.body:', req.body)
            if (!email || !newPassword) throwError("Email and new password are required", STATUS_CODES.BAD_REQUEST);
            await this.studentService.setNewPassword(email, newPassword);
            sendResponse(res, STATUS_CODES.OK, "Password updated", true);
        } catch (err) {
            handleControllerError(res, err);
        }
    }
    async resendOtp(req: Request, res: Response) {
        try {
            const { email, purpose } = req.body; // example: "signup" or "forgot-password"
            if (!email || !purpose) {
                throwError("Email and purpose are required", STATUS_CODES.BAD_REQUEST);
            }
            await this.studentService.resendOtp(email, purpose);
            sendResponse(res, STATUS_CODES.OK, "OTP resent successfully", true);
        } catch (err) {
            handleControllerError(res, err);
        }
    }


}
