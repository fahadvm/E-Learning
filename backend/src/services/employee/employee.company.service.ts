import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IEmployeeCompanyService } from '../../core/interfaces/services/employee/IEmployeeCompanyService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IEmployee } from '../../models/Employee';
import mongoose from 'mongoose';

export enum EmployeeStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REVOKED = 'revoked',
  NONE = 'notRequsted',
  INVITED = 'invited',
  REJECTED = 'rejected'
}

@injectable()
export class EmployeeCompanyService implements IEmployeeCompanyService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly companyRepo: ICompanyRepository,
    @inject(TYPES.EmployeeRepository)
    private readonly employeeRepo: IEmployeeRepository
  ) { }

  async getMyCompany(employeeId: string): Promise<IEmployee | null> {
    const company = await this.employeeRepo.findCompanyByEmployeeId(employeeId);
    return company;
  }

  async getRequestedCompany(employeeId: string): Promise<IEmployee | null> {
    const company = await this.employeeRepo.findRequestedCompanyByEmployeeId(employeeId);
    return company;
  }

  async getInvitation(employeeId: string): Promise<any | null> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || !employee.invitedBy) return null;

    // Populate invitedBy to get company details
    // Assuming findById populates or we can do a separate fetch
    // If invitedBy is just ID, we need to fetch company
    const company = await this.companyRepo.findById(employee.invitedBy.toString());
    return company;
  }

  async acceptInvite(employeeId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || !employee.invitedBy)
      throwError("No invitation found", STATUS_CODES.NOT_FOUND);

    await this.employeeRepo.updateById(employeeId, {
      companyId: employee.invitedBy,
      invitedBy: null,
      invitedAt: null,
      status: 'approved', // Active/Approved
      // Clear any request
      requestedCompanyId: null
    });

    // Also need to add employee to company's employee list!
    // This logic might be better in a "CompanyService" but we do it here
    await this.companyRepo.addEmployee(employee.invitedBy.toString(), employeeId);
  }

  async rejectInvite(employeeId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || !employee.invitedBy)
      throwError("No invitation found", STATUS_CODES.NOT_FOUND);

    await this.employeeRepo.updateById(employeeId, {
      invitedBy: null,
      invitedAt: null,
      status: 'notRequsted'
    });
  }

  async findCompanyByCode(code: string) {
    const company = await this.companyRepo.findByCompanyCode(code);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return company;
  }

  async sendRequest(employeeId: string, companyId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (employee.status === EmployeeStatus.REQUESTED || employee.status === EmployeeStatus.INVITED)
      throwError(MESSAGES.ALREADY_REQUESTED_COMPANY, STATUS_CODES.CONFLICT);

    const requestedCompanyId = new mongoose.Types.ObjectId(companyId);
    console.log("requested company id ", requestedCompanyId)
    await this.employeeRepo.updateById(employeeId, { requestedCompanyId, status: EmployeeStatus.REQUESTED });
  }

  async cancelRequest(employeeId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || employee.status === EmployeeStatus.NONE)
      throwError(MESSAGES.NO_REQUEST_FOUND, STATUS_CODES.NOT_FOUND);

    await this.employeeRepo.updateCancelRequestById(employeeId);
  }

  async leaveCompany(employeeId: string): Promise<void> {
    const employee = await this.employeeRepo.findById(employeeId);
    if (!employee || employee.status !== EmployeeStatus.APPROVED)
      throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.BAD_REQUEST);

    await this.employeeRepo.updateById(employeeId, {
      status: EmployeeStatus.NONE,
      companyId: null,
    });

    console.log("company leaved")

    // Also remove from company list
    if (employee.companyId) {
      await this.companyRepo.removeEmployee(employee.companyId.toString(), employeeId);
    }
  }
}
