// src/controllers/employee/employee.company.controller.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IEmployeeCompanyService } from "../../core/interfaces/services/employee/IEmployeeCompanyService";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";

// ✅ Define all messages as constants

@injectable()
export class EmployeeCompanyController  {
  constructor(
    @inject(TYPES.EmployeeCompanyService)
    private readonly _employeeCompanyService: IEmployeeCompanyService
  ) {}

  async getCompany(req: AuthRequest, res: Response) {
    const result = await this._employeeCompanyService.getMyCompany(req.user!.id);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_FETCHED, true, result);
  }

  async requestedCompany(req: AuthRequest, res: Response) {
    const result = await this._employeeCompanyService.getRequestedCompany(req.user!.id);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_FETCHED, true, result);
  }

  async findCompany(req: AuthRequest, res: Response) {
    const { companycode } = req.body;
    const result = await this._employeeCompanyService.findCompanyByCode(companycode);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPANY_FOUND, true, result);
  }

  async sendRequest(req: AuthRequest, res: Response) {
    const { companyId } = req.body;
    await this._employeeCompanyService.sendRequest(req.user!.id, companyId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.REQUEST_SENT, true);
  }

  async cancelRequest(req: AuthRequest, res: Response) {
    const result = await this._employeeCompanyService.cancelRequest(req.user!.id);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.REQUEST_CANCELLED, true, result);
  }

  async leaveCompany(req: AuthRequest, res: Response) {
    await this._employeeCompanyService.leaveCompany(req.user!.id);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.LEFT_COMPANY, true);
  }
}
