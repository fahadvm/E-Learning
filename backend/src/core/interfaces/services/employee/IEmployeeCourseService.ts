import { ICompanyOrder } from "../../../../models/CompanyOrder"
import { ICourse } from "../../../../models/Course"
export interface IEmployeeCourseService {
  getMyCourses(employeeId: string): Promise<ICompanyOrder[] | null>
  getMyCourseDetails(employeeId: string, courseId: string): Promise<ICourse | null>
}
