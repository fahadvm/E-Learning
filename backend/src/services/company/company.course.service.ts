import { inject, injectable } from 'inversify';
import { ICompanyCourseService } from '../../core/interfaces/services/company/ICompanyCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { ICourse } from '../../models/Course';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICompanyOrderRepository } from '../../core/interfaces/repositories/ICompanyOrderRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { ICourseResource } from '../../models/CourseResource';
import { ICourseResourceRepository } from '../../core/interfaces/repositories/ICourseResourceRepository';
import { ICompanyCoursePurchaseRepository } from '../../core/interfaces/repositories/ICompanyCoursePurchaseRepository';
import mongoose from 'mongoose';
import { ICompanyCoursePurchase } from '../../models/CompanyCoursePurchase';
import { CompanyCourseDTO, PaginatedCourseDTO } from '../../core/dtos/company/Company.course.Dto';

@injectable()
export class CompanyCourseService implements ICompanyCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository,
    @inject(TYPES.CompanyOrderRepository) private readonly _companyOrderRepository: ICompanyOrderRepository,
    @inject(TYPES.CompanyCoursePurchaseRepository) private readonly _purchasedRepository: ICompanyCoursePurchaseRepository,
    @inject(TYPES.EmployeeRepository) private readonly _employeeRepo: IEmployeeRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository
  ) { }

  async getAllCourses(filters: {
    search?: string;
    category?: string;
    level?: string;
    language?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    isBlocked?: boolean;
    isPublished?: boolean;
  }): Promise<PaginatedCourseDTO> {
    const { data, totalCount, totalPages } =
      await this._courseRepository.getFilteredCourses({
        ...filters,
        isBlocked: false,
        isPublished: true,
      });

    return {
      data: data.map(CompanyCourseDTO),
      totalCount,
      totalPages,
    };
  }

  async getCourseDetail(courseId: string): Promise<ICourse | null> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }

  async assignCourseToEmployee(courseId: string, employeeId: string): Promise<void> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND);

    const companyId = (employee.companyId as unknown as { _id?: string })?._id?.toString() || employee.companyId?.toString();
    if (!companyId) throwError('Employee is not associated with any company', STATUS_CODES.BAD_REQUEST);

    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND);

    if (course.isBlocked) {
      throwError('This course is blocked by admin and cannot be assigned to employees.', STATUS_CODES.FORBIDDEN);
    }

    const alreadyAssigned = employee.coursesAssigned?.some(
      (c) => {
        const cRef = c as unknown as { _id?: string };
        return (cRef._id?.toString() || (c as unknown as string)) === courseId;
      }
    );

    if (alreadyAssigned) return;

    // Increase seat usage in the purchase record
    await this._purchasedRepository.increaseSeatUsage(
      new mongoose.Types.ObjectId(companyId),
      new mongoose.Types.ObjectId(courseId)
    );

    return await this._employeeRepo.assignCourseToEmployee(courseId, employeeId);
  }

  async getMycoursesById(companyId: string): Promise<ICompanyCoursePurchase[] | null> {
    const companyIdObj = new mongoose.Types.ObjectId(companyId);
    const orders = await this._purchasedRepository.getAllPurchasesByCompany(companyIdObj);
    return orders;
  }

  async getMycourseDetailsById(companyId: string, courseId: string): Promise<ICourse | null> {
    if (!courseId || !companyId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const orders = await this._companyOrderRepository.getOrdersByCompanyId(companyId);
    const purchasedCourseIds = orders.flatMap((order) => order.purchasedCourses.map((c) => c.courseId.toString()));

    if (!purchasedCourseIds.includes(courseId)) { throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND); }

    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (course.isBlocked) {
      throwError('Access to this course has been disabled by admin. Reason: ' + (course.blockReason || 'No reason provided'), STATUS_CODES.FORBIDDEN);
    }
    return course;
  }

  async getResources(courseId: string): Promise<ICourseResource[]> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (course.isBlocked) {
      throwError('Course resources are unavailable as the course is blocked by admin.', STATUS_CODES.FORBIDDEN);
    }
    return this._resourceRepository.getResourcesByCourse(courseId);
  }
}
