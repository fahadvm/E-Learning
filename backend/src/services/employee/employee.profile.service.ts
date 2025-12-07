import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IEmployeeProfileService } from '../../core/interfaces/services/employee/IEmployeeProfileService';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { IEmployee } from '../../models/Employee';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { employeeProfileDto, IEmployeeProfileDTO } from '../../core/dtos/employee/employee.profile.dto';

@injectable()
export class EmployeeProfileService implements IEmployeeProfileService {
  constructor(
    @inject(TYPES.EmployeeRepository)
    private readonly _employeeRepo: IEmployeeRepository
  ) { }

  async getProfile(employeeId: string): Promise<IEmployee> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return employee

  }

  async updateEmployeeProfile(employeeId: string, data: Partial<IEmployee>): Promise<IEmployeeProfileDTO> {
    const updated = await this._employeeRepo.updateById(employeeId, data);
    if (!updated) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return employeeProfileDto(updated);
  }
}
