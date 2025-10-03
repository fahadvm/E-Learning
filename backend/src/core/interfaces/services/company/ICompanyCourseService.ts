import { ICourse } from '../../../../models/Course';
import { ICompanyOrder } from '../../../../models/CompanyOrder';

export interface ICompanyCourseService {
  getAllCourses(): Promise<ICourse[]>;
  getCourseDetail(courseId: string): Promise<ICourse | null>;
  getMycoursesById(companyId: string): Promise<ICompanyOrder[] | null>;
  getMycourseDetailsById(companyId: string, courseId: string): Promise<ICourse | null>

}
