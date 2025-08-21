import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { IAdminAuthService } from '../../core/interfaces/services/admin/IAdminAuthService';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse} from '../../utils/ResANDError';
import { setTokensInCookies, clearTokens } from '../../utils/JWTtoken';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';

@injectable()
export class AdminAuthController {
    constructor(
        @inject(TYPES.AdminAuthService) private _adminService: IAdminAuthService
    ) { }

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        console.log(req.body)
        const { token, refreshToken, admin } = await this._adminService.login(email, password);
        setTokensInCookies(res, token, refreshToken);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGIN_SUCCESS, true, admin);
    }

    async logout(req: Request, res: Response) {
        clearTokens(res);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.LOGOUT_SUCCESS, true);
    }

}
