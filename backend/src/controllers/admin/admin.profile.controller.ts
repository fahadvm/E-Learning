import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAdminProfileService } from '../../core/interfaces/services/admin/IAdminProfileService';
import { IAdminProfileController } from '../../core/interfaces/controllers/admin/IAdminProfileController';
import { TYPES } from '../../core/di/types';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class AdminProfileController implements IAdminProfileController {
  constructor(
    @inject(TYPES.AdminProfileService)
    private readonly _profileService: IAdminProfileService
  ) { }

  getProfile = async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const profile = await this._profileService.getProfile(adminId); return sendResponse(res, STATUS_CODES.OK, MESSAGES.ADMIN_PROFILE_FETCHED, true, profile);
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const updates = req.body;
    const updatedProfile = await this._profileService.updateProfile(adminId, updates);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PROFILE_UPDATED, true, updatedProfile);
  };

  changePassword = async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      throwError(MESSAGES.INVALID_DATA, STATUS_CODES.BAD_REQUEST);
    }

    if (newPassword !== confirmPassword) {
      throwError('Passwords do not match', STATUS_CODES.BAD_REQUEST);
    }

    await this._profileService.changePassword(adminId, currentPassword, newPassword);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PASSWORD_CHANGED, true);
  };

  requestEmailChange = async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { newEmail } = req.body;
    if (!newEmail) throwError('New email is required', STATUS_CODES.BAD_REQUEST);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      throwError('Invalid email format', STATUS_CODES.BAD_REQUEST);
    }

    await this._profileService.requestEmailChange(adminId, newEmail);
    return sendResponse(res, STATUS_CODES.OK, 'OTP sent to new email address', true);
  };

  verifyEmailChangeOtp = async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { newEmail, otp } = req.body;
    if (!newEmail || !otp) throwError('Email and OTP are required', STATUS_CODES.BAD_REQUEST);

    await this._profileService.verifyEmailChangeOtp(adminId, newEmail, otp);
    return sendResponse(res, STATUS_CODES.OK, 'Email updated successfully', true);
  };

  addNewAdmin = async (req: AuthRequest, res: Response) => {
    const adminId = req.user?.id;
    if (!adminId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { email, password, name } = req.body;
    if (!email || !password) {
      throwError('Email and password are required', STATUS_CODES.BAD_REQUEST);
    }

    const newAdmin = await this._profileService.addNewAdmin(adminId, email, password, name);
    return sendResponse(res, STATUS_CODES.CREATED, 'Admin created successfully', true, newAdmin);
  };
}