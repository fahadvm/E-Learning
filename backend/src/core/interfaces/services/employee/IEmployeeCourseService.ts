import { ICompanyOrder } from '../../../../models/CompanyOrder';
import { ICourse } from '../../../../models/Course';
import { IEmployee } from '../../../../models/Employee';
export interface IEmployeeCourseService {
  getMyCourses(employeeId: string): Promise<IEmployee | null>
  getMyCourseDetails(employeeId: string, courseId: string): Promise<ICourse | null>
}
