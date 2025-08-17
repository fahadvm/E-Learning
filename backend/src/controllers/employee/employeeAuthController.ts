import { injectable, inject } from 'inversify';
import { IEmployeeAuthService } from '../../core/interfaces/services/employee/IEmployeeAuthService';
import { setTokensInCookies } from '../../utils/JWTtoken';
import { handleControllerError, sendResponse } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import {Request , Response} from 'express';


@injectable()

export class EmployeeAuthController{
    constructor(
        @inject('EmployeeAuthService') private employeeService: IEmployeeAuthService
    ) {}

    async login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const { token, refreshToken, user } = await this.employeeService.login(email, password);

        setTokensInCookies(res, token, refreshToken);

        return sendResponse(res, STATUS_CODES.OK, 'Login successful', true, user);

    } catch (err) {
        handleControllerError(res, err);
    }
}

}

