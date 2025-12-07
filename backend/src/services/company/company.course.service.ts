import { inject, injectable } from 'inversify';
import { ICompanyCourseService } from '../../core/interfaces/services/company/ICompanyCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { ICourse } from '../../models/Course';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ICompanyOrder } from '../../models/CompanyOrder';
import { ICompanyOrderRepository } from '../../core/interfaces/repositories/ICompanyOrderRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { IEmployee } from '../../models/Employee';
import { ICourseResource } from '../../models/CourseResource';
import { ICourseResourceRepository } from '../../core/interfaces/repositories/ICourseResourceRepository';
import { ICompanyCoursePurchaseRepository } from '../../core/interfaces/repositories/ICompanyCoursePurchaseRepository';
import mongoose from 'mongoose';
import { ICompanyCoursePurchase } from '../../models/CompanyCoursePurchase';

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
  }): Promise<{ data: ICourse[]; totalPages: number; totalCount: number }> {
    const courses = await this._courseRepository.getFilteredCourses(filters);
    return courses;
  }

  async getCourseDetail(courseId: string): Promise<ICourse | null> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }

  async assignCourseToEmployee(courseId: string, employeeId: string): Promise<void> {

    const employee = await this._employeeRepo.findById(employeeId)
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND);


    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND);


    return await this._employeeRepo.assignCourseToEmployee(courseId, employeeId)

  }

  async getMycoursesById(companyId: string): Promise<ICompanyCoursePurchase[] | null> {
    const companyIdObj = new mongoose.Types.ObjectId(companyId)
    const orders = await this._purchasedRepository.getAllPurchasesByCompany(companyIdObj);
    console.log("orders in service", orders)
    return orders;
  }
  async getMycourseDetailsById(companyId: string, courseId: string): Promise<ICourse | null> {
    if (!courseId || !companyId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const orders = await this._companyOrderRepository.getOrdersByCompanyId(companyId);
    const purchasedCourseIds = orders.flatMap((order) => order.courses.map((c) => c.toString()));

    if (!purchasedCourseIds.includes(courseId)) { throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND); }

    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }

  async getResources(courseId: string): Promise<ICourseResource[]> {
    return this._resourceRepository.getResourcesByCourse(courseId);
  }


}
