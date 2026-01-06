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
import { ICompanyChatService } from '../../core/interfaces/services/company/ICompanyChatService';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { removeFromCompanyLeaderboard } from '../../utils/redis/leaderboard';
import { ICourseProgress } from '../../models/Student';
import { emitToUser } from '../../config/socket';
import { sendInvitationLinkEmail } from '../../utils/OtpServices';


@injectable()
export class CompanyEmployeeService implements ICompanyEmployeeService {
    constructor(
        @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository,
        @inject(TYPES.CompanyRepository) private _companyRepo: ICompanyRepository,
        @inject(TYPES.EmployeeLearningPathRepository) private _learningPathRepo: IEmployeeLearningPathRepository,
        @inject(TYPES.CompanyCoursePurchaseRepository) private _purchaseRepo: ICompanyCoursePurchaseRepository,
        @inject(TYPES.EmployeeLearningPathProgressRepository) private _learningPathAssignRepo: IEmployeeLearningPathProgressRepository,
        @inject(TYPES.CompanyChatService) private _companyChatService: ICompanyChatService,
        @inject(TYPES.NotificationService) private _notificationService: INotificationService

    ) { } // Injected CompanyRepository


    async getAllEmployees(
        companyId: string,
        page: number,
        limit: number,
        search: string,
        sortBy: string,
        sortOrder: string,
        department?: string,
        position?: string
    ): Promise<PaginatedEmployeeDTO> {
        const total = await this._employeeRepo.countEmployeesByCompany(companyId, search, department, position);
        const skip = (page - 1) * limit;
        const employees = await this._employeeRepo.findByCompanyId(companyId, skip, limit, search, sortBy, sortOrder, department, position);
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
        const employee = await this._employeeRepo.findById(id);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        await this._employeeRepo.blockEmployee(id, status);

        const action = status ? 'blocked' : 'unblocked';
        const companyId = employee.companyId?._id.toString();
        const company = companyId ? await this._companyRepo.findById(companyId) : null;

        // Notify Company
        if (companyId) {
            await this._notificationService.createNotification(
                companyId,
                `Employee ${action}`,
                `Employee ${employee.name} has been ${action}.`,
                'employee',
                'company',
                `/company/employees/${id}`
            );
        }

        if (status) {
            // Real-time logout trigger
            emitToUser(id, 'accountBlocked', {
                message: 'Your account has been blocked by the company. You will be logged out shortly.'
            });
        }

        // Notify Employee
        await this._notificationService.createNotification(
            id,
            `Account ${action}`,
            `Your account has been ${action} by ${company?.name || 'the company'}.`,
            'system',
            'employee'
        );
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

            // Add to Company Group Chat
            const company = await this._companyRepo.findById(companyId);
            if (company) {
                await this._companyChatService.createCompanyGroup(companyId, company.name); // Ensure group exists
                await this._companyChatService.addEmployeeToGroup(companyId, employeeId);

                // Notify Company
                await this._notificationService.createNotification(
                    companyId,
                    'New Employee Joined',
                    `${employee.name} has joined the company.`,
                    'employee',
                    'company',
                    `/company/employees/${employeeId}`
                );

                // Notify Employee
                await this._notificationService.createNotification(
                    employeeId,
                    'Application Approved',
                    `Your request to join ${company.name} has been approved.`,
                    'system',
                    'employee',
                    '/employee/dashboard'
                );
            }
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

        // Notify Employee
        await this._notificationService.createNotification(
            employeeId,
            'Application Rejected',
            `Your request to join the company has been rejected. Reason: ${reason}`,
            'system',
            'employee'
        );

        return updated;
    }

    async inviteEmployee(companyId: string, email: string): Promise<IEmployee | null> {
        // Check if employee exists
        const employee = await this._employeeRepo.findByEmail(email);
        const company = await this._companyRepo.findById(companyId);
        if(!company)throwError(MESSAGES.COMPANY_NOT_FOUND,STATUS_CODES.UNAUTHORIZED);

        if (employee) {
            // Employee exists, send invitation
            if (employee.companyId) {
                throwError('Employee already belongs to a company', STATUS_CODES.BAD_REQUEST);
            }

            if (employee.status === 'requested' || employee.status === 'invited') {
                throwError('Employee already has a pending request or invitation', STATUS_CODES.CONFLICT);
            }

            const updated = await this._employeeRepo.updateById(employee._id.toString(), {
                requestedCompanyId: null,
                status: 'invited',
                invitedBy: new mongoose.Types.ObjectId(companyId),
                invitedAt: new Date()
            });


            // Notify Employee
            if (company) {
                await this._notificationService.createNotification(
                    employee._id.toString(),
                    'New Invitation',
                    `You have been invited to join ${company.name}.`,
                    'invitation',
                    'employee',
                    '/employee/requests'
                );
            }

            return updated;
        }

        // Employee doesn't exist - return null to indicate invitation link should be sent
        const invitationLink = `${process.env.FRONTEND_URL}/employee/signup`;
        await sendInvitationLinkEmail(email, company.name, company.companyCode, invitationLink);

        return null;
    }

    async searchEmployees(query: string): Promise<IEmployee[]> {
        return await this._employeeRepo.searchByEmailOrName(query);
    }

    async removeEmployee(companyId: string, employeeId: string): Promise<void> {
        const employee = await this._employeeRepo.findById(employeeId);
        if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

        if (employee.companyId?._id.toString() !== companyId) {
            throwError('Employee does not belong to this company', STATUS_CODES.FORBIDDEN);
        }

        /* 1 Find assigned learning paths */
        const assignedPaths = await this._learningPathAssignRepo.findAssigned(companyId, employeeId);

        /* 2 For each learning path → decrease seat usage */
        for (const path of assignedPaths) {
            const lp = await this._learningPathRepo.findOneForCompany(companyId, path.learningPathId._id.toString());
            if (lp) {
                for (const course of lp.courses) {
                    await this._purchaseRepo.decreaseSeatUsage(
                        new mongoose.Types.ObjectId(companyId),
                        new mongoose.Types.ObjectId(course.courseId.toString())
                    );
                }
            }

            /* 3️ Remove assigned progress */
            await this._learningPathAssignRepo.delete(companyId, employeeId, path.learningPathId._id.toString());
        }

        const individualCourses = employee.coursesAssigned || [];
        for (const courseData of individualCourses) {
            const cDataRef = courseData as unknown as { _id?: string };
            const courseId = cDataRef?._id?.toString() || (courseData as unknown as string);
            await this._purchaseRepo.decreaseSeatUsage(
                new mongoose.Types.ObjectId(companyId),
                new mongoose.Types.ObjectId(courseId)
            );
        }

        /* 4️ Remove employee from company */
        await this._employeeRepo.updateById(employeeId, {
            companyId: null,
            status: 'notRequsted'
        });

        await this._companyRepo.removeEmployee(companyId, employeeId);

        // Remove from Leaderboard
        await removeFromCompanyLeaderboard(companyId, employeeId);

        // Remove from Company Group Chat
        await this._companyChatService.removeEmployeeFromGroup(companyId, employeeId);

        const company = await this._companyRepo.findById(companyId);

        // Notify Company
        await this._notificationService.createNotification(
            companyId,
            'Employee Removed',
            `${employee.name} has been removed from the company.`,
            'employee',
            'company'
        );

        // Notify Employee
        await this._notificationService.createNotification(
            employeeId,
            'Removed from Company',
            `You have been removed from ${company?.name || 'the company'}.`,
            'system',
            'employee'
        );
    }

    async getEmployeeProgress(employeeId: string): Promise<ICourseProgress[] | null> {
        return await this._employeeRepo.getProgress(employeeId);
    }


}
