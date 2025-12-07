// services/company/CompanyEmployeeService.ts

import mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { ICompanyEmployeeService } from '../../core/interfaces/services/company/ICompanyEmployeeService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { IEmployee } from '../../models/Employee';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { PaginatedEmployeeDTO, companyEmployeeDto } from '../../core/dtos/company/company.employee.Dto';
import { ICompanyCoursePurchaseRepository } from '../../core/interfaces/repositories/ICompanyCoursePurchaseRepository';
import { IEmployeeLearningPathRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathRepository';
import { IEmployeeLearningPathProgressRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathProgressRepository';


@injectable()
export class CompanyEmployeeService implements ICompanyEmployeeService {
    constructor(
        @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository,
        @inject(TYPES.CompanyRepository) private _companyRepo: ICompanyRepository,
        @inject(TYPES.EmployeeLearningPathRepository) private _learningPathRepo: IEmployeeLearningPathRepository,
        @inject(TYPES.CompanyCoursePurchaseRepository) private _purchaseRepo: ICompanyCoursePurchaseRepository,
        @inject(TYPES.EmployeeLearningPathProgressRepository) private _learningPathAssignRepo: IEmployeeLearningPathProgressRepository,

    ) { } // Injected CompanyRepository


    async getAllEmployees(companyId: string, page: number, limit: number, search: string, sortBy: string, sortOrder: string): Promise<PaginatedEmployeeDTO> {
        const total = await this._employeeRepo.countEmployeesByCompany(companyId, search);
        const skip = (page - 1) * limit;
        const employees = await this._employeeRepo.findByCompanyId(companyId, skip, limit, search, sortBy, sortOrder);
        const totalPages = Math.ceil(total / limit);
        return {
            employees: employees.map(companyEmployeeDto),
            total,
            totalPages,
        };
    }

    async getEmployeeById(employeeId: string): Promise<IEmployee | null> {
        return await this._employeeRepo.findById(employeeId);
    }

    async blockEmployee(id: string, status: boolean): Promise<void> {
        const employee = await this._employeeRepo.blockEmployee(id, status);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
        await this._employeeRepo.blockEmployee(id, status);
    }


    async updateEmployee(employeeId: string, data: Partial<IEmployee>): Promise<IEmployee | null> {
        return await this._employeeRepo.updateById(employeeId, data);
    }

    async requestedEmployees(companyId: string): Promise<IEmployee[] | null> {
        const courses = await this._employeeRepo.findRequestedEmployees(companyId);
        return courses;
    }

    async approvingEmployee(companyId: string, employeeId: string): Promise<IEmployee | null> {
        const employee = await this._employeeRepo.findEmployeeAndApprove(companyId, employeeId);
        if (employee) {
            await this._companyRepo.addEmployee(companyId, employeeId);
        }
        return employee;
    }

    async rejectingEmployee(employeeId: string, reason: string): Promise<IEmployee | null> {
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        const updated = await this._employeeRepo.updateById(employeeId, {
            status: 'rejected',
            rejectionReason: reason,
            rejectedAt: new Date(),
            requestedCompanyId: null
        });
        return updated;
    }

    async inviteEmployee(companyId: string, email: string): Promise<IEmployee | null> {
        // Check if employee exists
        const employee = await this._employeeRepo.findByEmail(email);

        if (employee) {
            // Employee exists, send invitation
            if (employee.companyId) {
                throwError('Employee already belongs to a company', STATUS_CODES.BAD_REQUEST);
            }

            if (employee.status === 'requested' || employee.status === 'invited') {
                throwError('Employee already has a pending request or invitation', STATUS_CODES.CONFLICT);
            }

            const updated = await this._employeeRepo.updateById(employee._id.toString(), {
                requestedCompanyId: null, // Clear any previous request
                status: 'invited',
                invitedBy: new mongoose.Types.ObjectId(companyId),
                invitedAt: new Date()
            });
            return updated;
        }

        // Employee doesn't exist - return null to indicate invitation link should be sent
        return null;
    }

    async searchEmployees(query: string): Promise<IEmployee[]> {
        return await this._employeeRepo.searchByEmailOrName(query);
    }

    async removeEmployee(companyId: string, employeeId: string): Promise<void> {
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        if (employee.companyId?.toString() !== companyId) {
            throwError('Employee does not belong to this company', STATUS_CODES.FORBIDDEN);
        }

        /* 1 Find assigned learning paths */
        const assignedPaths = await this._learningPathAssignRepo.findAssigned(companyId, employeeId);
console.log('checkpoint 1')
        /* 2 For each learning path → decrease seat usage */
        console.log("assignedPaths",assignedPaths)
        for (const path of assignedPaths) {
console.log('checkpoint 1.5',companyId, path.learningPathId._id.toString())
            const lp = await this._learningPathRepo.findOneForCompany(companyId, path.learningPathId._id.toString());
console.log('checkpoint 1')

            if (lp) {
                for (const course of lp.courses) {
                    await this._purchaseRepo.decreaseSeatUsage(
                        new mongoose.Types.ObjectId(companyId),
                        new mongoose.Types.ObjectId(course.courseId.toString())
                    );
                }
            }
console.log('checkpoint 1')

            /* 3️ Remove assigned progress */
            await this._learningPathAssignRepo.delete(companyId, employeeId, path.learningPathId._id.toString());
        }
console.log('checkpoint 1')

        /* 4️ Remove employee from company */
        await this._employeeRepo.updateById(employeeId, {
            companyId: null,
            status: 'notRequsted'
        });

        await this._companyRepo.removeEmployee(companyId, employeeId);
    }


}
