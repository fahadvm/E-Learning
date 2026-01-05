import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminCompanyService } from '../../core/interfaces/services/admin/IAdminCompanyService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { ICompanyCoursePurchaseRepository } from '../../core/interfaces/repositories/ICompanyCoursePurchaseRepository';
import { IEmployeeLearningPathProgressRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathProgressRepository';
import { throwError } from '../../utils/ResANDError';
import mongoose from 'mongoose';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { adminCompanyDto, IAdminCompanyDto, IAdminCompanyEmployeeDto, adminCompanyEmployeeDto, IAdminCompanyDetailsDto } from '../../core/dtos/admin/Admin.company.Dto';
import { IEmployee } from '../../models/Employee';

@injectable()
export class AdminCompanyService implements IAdminCompanyService {
  constructor(
    @inject(TYPES.CompanyRepository)
    private readonly _companyRepo: ICompanyRepository,

    @inject(TYPES.EmployeeRepository)
    private readonly _employeeRepo: IEmployeeRepository,

    @inject(TYPES.CompanyCoursePurchaseRepository)
    private readonly _purchasedRepo: ICompanyCoursePurchaseRepository,

    @inject(TYPES.EmployeeLearningPathProgressRepository)
    private readonly _lpProgressRepo: IEmployeeLearningPathProgressRepository
  ) { }

  async getAllCompanies(
    page: number,
    limit: number,
    search: string
  ): Promise<{ companies: IAdminCompanyDto[]; total: number; totalPages: number }> {
    const companies = await this._companyRepo.getAllCompanies(page, limit, search);
    const total = await this._companyRepo.countCompanies(search);
    const totalPages = Math.ceil(total / limit);
    return { companies: companies.map(adminCompanyDto), total, totalPages };
  }

  async getCompanyById(companyId: string): Promise<IAdminCompanyDetailsDto> {
    const company = await this._companyRepo.findById(companyId);
    if (!company) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const employees = (company.employees as unknown as IEmployee[]) || [];
    // Fetch accurate course usage from the devoted repository
    const companyIdObj = new mongoose.Types.ObjectId(companyId);
    const purchases = await this._purchasedRepo.getAllPurchasesByCompany(companyIdObj);
    const courses = await Promise.all(purchases.map(async (p) => {
      const courseData = p.courseId as any;
      const courseId = courseData._id?.toString() || p.courseId.toString();

      // Calculate dynamic counts to ensure data integrity
      const individualCount = employees.filter(emp =>
        emp.coursesAssigned?.some((id: any) => (id._id?.toString() || id.toString()) === courseId)
      ).length;

      const lpCount = await this._lpProgressRepo.countAssignedSeats(companyId, courseId);

      return {
        _id: courseId,
        title: courseData.title || "Unknown Course",
        seatsPurchased: p.seatsPurchased,
        seatsUsed: Math.max(p.seatsUsed, individualCount, lpCount)
      };
    }));

    // Process employees with learning path data
    const employeesWithLPData = await Promise.all(
      employees.map(async (emp) => {
        const lpProgress = await this._lpProgressRepo.findByEmployeeId(emp._id.toString());
        let totalCourses = 0;
        let completedCourses = 0;
        if (lpProgress && lpProgress.learningPathId) {
          const EmployeeLearningPath = (await import('../../models/EmployeeLearningPath')).EmployeeLearningPath;
          const learningPath = await EmployeeLearningPath.findById(lpProgress.learningPathId);

          if (learningPath) {
            totalCourses = learningPath.courses?.length || 0;
            completedCourses = lpProgress.completedCourses?.length || 0;
          }
        }

        // If no learning path, fall back to directly assigned courses
        if (totalCourses === 0) {
          totalCourses = emp.coursesAssigned?.length || 0;
          completedCourses = emp.coursesProgress?.filter(cp => cp.percentage >= 100).length || 0;
        }

        return {
          _id: emp._id.toString(),
          name: emp.name,
          email: emp.email,
          position: emp.position,
          avatar: emp.profilePicture,
          isBlocked: emp.isBlocked,
          coursesAssigned: totalCourses,
          coursesCompleted: completedCourses
        };
      })
    );

    return {
      company: adminCompanyDto(company),
      employees: employeesWithLPData,
      courses
    };
  }

  async getUnverifiedCompanies(
    page: number,
    limit: number,
    search: string
  ): Promise<{ companies: IAdminCompanyDto[]; total: number; totalPages: number }> {
    const companies = await this._companyRepo.getUnverifiedCompanies(page, limit, search);
    const total = await this._companyRepo.countUnverifiedCompanies(search);
    const totalPages = Math.ceil(total / limit);

    return { companies: companies.map(adminCompanyDto), total, totalPages };
  }




  async getEmployeeById(employeeId: string): Promise<IAdminCompanyEmployeeDto> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyEmployeeDto(employee);
  }


  async verifyCompany(companyId: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.verifyCompany(companyId);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async rejectCompany(companyId: string, reason: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.rejectCompany(companyId, reason);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async blockCompany(companyId: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.blockCompany(companyId);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async unblockCompany(companyId: string): Promise<IAdminCompanyDto> {
    const updated = await this._companyRepo.unblockCompany(companyId);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminCompanyDto(updated);
  }

  async approveAllCompanies() {
    const updated = await this._companyRepo.approveAll();
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }

  async rejectAllCompanies(reason: string) {
    const updated = await this._companyRepo.rejectAll(reason);
    if (!updated) throwError(MESSAGES.COMPANY_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return updated;
  }
}
