import { ICompanyOrder } from '../../../../models/CompanyOrder';
import { ICourse } from '../../../../models/Course';
import { ICourseResource } from '../../../../models/CourseResource';
import { ICourseProgress, IEmployee } from '../../../../models/Employee';
export interface IEmployeeCourseService {
  getMyCourses(employeeId: string): Promise<IEmployee | null>
  getMyCourseDetails(employeeId: string, courseId: string): Promise<ICourse | null>
  markLessonComplete(employeeId: string, courseId: string, lessonId: string): Promise<ICourseProgress>;
  saveNotes(employeeId: string, courseId: string, notes: string): Promise<ICourseProgress>
  getResources(courseId: string): Promise<ICourseResource[]>
}
