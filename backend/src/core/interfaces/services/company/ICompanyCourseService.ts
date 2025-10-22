import { ICourse } from '../../../../models/Course';
import { ICompanyOrder } from '../../../../models/CompanyOrder';
import { IEmployee } from '../../../../models/Employee';

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
  }): Promise<{ data: ICourse[]; totalPages: number; totalCount: number }>;
  getCourseDetail(courseId: string): Promise<ICourse | null>;
  getMycoursesById(companyId: string): Promise<ICompanyOrder[] | null>;
  getMycourseDetailsById(companyId: string, courseId: string): Promise<ICourse | null>
  assignCourseToEmployee(courseId: string, employeeId: string):Promise<void>

}
