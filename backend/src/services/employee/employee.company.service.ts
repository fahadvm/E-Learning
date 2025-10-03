import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { IEmployeeCompanyService } from "../../core/interfaces/services/employee/IEmployeeCompanyService";
import { ICompanyRepository } from "../../core/interfaces/repositories/ICompanyRepository";
import { IEmployeeRepository } from "../../core/interfaces/repositories/IEmployeeRepository";
import { throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import { IEmployee } from "../../models/Employee";
import mongoose from "mongoose";

export enum EmployeeStatus {
  PENDING = "pending",
  APPROVED = "approved",
  NOT_REQUEST = "notRequest",
}

@injectable()
export class EmployeeCompanyService implements IEmployeeCompanyService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly companyRepo: ICompanyRepository,
    @inject(TYPES.EmployeeRepository)
    private readonly employeeRepo: IEmployeeRepository
  ) {}

  async getMyCompany(employeeId: string): Promise<IEmployee | null> {
    const company = await this.employeeRepo.findCompanyByEmployeeId(employeeId);
    return company;
  }

  async getRequestedCompany(employeeId: string): Promise<IEmployee | null> {
    const company = await this.employeeRepo.findRequestedCompanyByEmployeeId(employeeId);
    return company;
  }

  async findCompanyByCode(code: string) {
    const company = await this.companyRepo.findByCompanyCode(code);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return company;
  }

  async sendRequest(employeeId: string, companyId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (employee.status === EmployeeStatus.PENDING)
      throwError(MESSAGES.ALREADY_REQUESTED_COMPANY, STATUS_CODES.CONFLICT);

    const requestedCompanyId = new mongoose.Types.ObjectId(companyId);
    await this.employeeRepo.updateById(employeeId, { requestedCompanyId, status: EmployeeStatus.PENDING });
  }

  async cancelRequest(employeeId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || employee.status === EmployeeStatus.NOT_REQUEST)
      throwError(MESSAGES.NO_REQUEST_FOUND, STATUS_CODES.NOT_FOUND);

    await this.employeeRepo.updateCancelRequestById(employeeId);
  }

  async leaveCompany(employeeId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || employee.status !== EmployeeStatus.APPROVED)
      throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.BAD_REQUEST);

    await this.employeeRepo.updateById(employeeId, {
      status: EmployeeStatus.NOT_REQUEST,
      companyId: undefined,
    });
  }
}
