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

@injectable()
export class CompanyCourseService implements ICompanyCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository,
    @inject(TYPES.CompanyOrderRepository) private readonly _companyOrderRepository: ICompanyOrderRepository
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

  

  async getMycoursesById(companyId: string): Promise<ICompanyOrder[] | null> {
    const orders = await this._companyOrderRepository.getOrdersByCompanyId(companyId);
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


}
