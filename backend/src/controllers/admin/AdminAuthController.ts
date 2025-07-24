import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { IAdminAuthService } from "../../core/interfaces/services/admin/IAdminAuthService";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { handleControllerError, sendResponse, throwError } from "../../utils/ResANDError";
import { setTokensInCookies, clearTokens } from "../../utils/JWTtoken";

@injectable()
export class AdminAuthController {
  constructor(
    @inject("AdminAuthService") private adminService: IAdminAuthService
  ) {}

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { token, refreshToken, admin } = await this.adminService.login(email, password);
      setTokensInCookies(res, token, refreshToken);
      return sendResponse(res, STATUS_CODES.OK, "Admin login successful", true, admin);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

async logout(req: Request, res: Response) {
  try {
    clearTokens(res); // clears token cookies
    return sendResponse(res, STATUS_CODES.OK, "Logged out successfully", true);
  } catch (error) {
    handleControllerError(res, error);
  }
}


  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.adminService.getAllUsers();
      return sendResponse(res, STATUS_CODES.OK, "All users fetched successfully", true, users);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async getAllCompanies(req: Request, res: Response) {
    try {
      const companies = await this.adminService.getAllCompanies();
      return sendResponse(res, STATUS_CODES.OK, "All companies fetched successfully", true, companies);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
