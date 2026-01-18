import { ICourse } from '../../../../models/Course';
import { ICourseResource } from '../../../../models/CourseResource';
import { ICompanyCoursePurchase } from '../../../../models/CompanyCoursePurchase';
import { PaginatedCourseDTO, ICompanyCourseDTO } from '../../../dtos/company/Company.course.Dto';

export interface ICompanyCourseService {
  getAllCourses(filters: {
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
  }): Promise<PaginatedCourseDTO>;
  getCourseDetail(courseId: string): Promise<ICompanyCourseDTO | null>;
  getMycoursesById(companyId: string): Promise<ICompanyCoursePurchase[] | null>;
  getMycourseDetailsById(companyId: string, courseId: string): Promise<ICompanyCourseDTO | null>
  assignCourseToEmployee(courseId: string, employeeId: string): Promise<void>
  getResources(courseId: string): Promise<ICourseResource[]>


}
