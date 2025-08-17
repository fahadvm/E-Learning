import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';

import { IAdminAuthService } from '../../core/interfaces/services/admin/IAdminAuthService';
import { IAdminRepository } from '../../core/interfaces/repositories/admin/IAdminRepository';


import { throwError } from '../../utils/ResANDError';
import { generateAccessToken, generateRefreshToken } from '../../utils/JWTtoken';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

import { TYPES } from '../../core/di/types';

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.AdminRepository) private _adminRepo: IAdminRepository,
  ) { }

  async login(email: string, password: string) {
    const admin = await this._adminRepo.findByEmail(email);
    if (!admin) {
      throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      throwError(MESSAGES.INVALID_CREDENTIALS, STATUS_CODES.UNAUTHORIZED);
    }

    const token = generateAccessToken(admin.id, 'admin');
    const refreshToken = generateRefreshToken(admin.id, 'admin');

    return {
      token,
      refreshToken,
      admin: {
        id: admin.id.toString(),
        email: admin.email,
        role: 'admin',
      },
    };
  }




}
