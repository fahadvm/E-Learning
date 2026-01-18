import { ICourseResource } from '../../../../models/CourseResource';
import { ICourseProgress, IEmployee } from '../../../../models/Employee';
import { IEmployeeLearningRecord } from '../../../../models/EmployeeLearningRecord';
import { IEmployeeFullCourseDTO } from '../../../dtos/employee/Employee.course.Dto';

export interface IEmployeeCourseService {
  getMyCourses(employeeId: string): Promise<IEmployee | null>
  getMyCourseDetails(employeeId: string, courseId: string): Promise<{ course: IEmployeeFullCourseDTO; progress: ICourseProgress }>
  markLessonComplete(employeeId: string, courseId: string, lessonId: string): Promise<ICourseProgress>;
  addLearningTime(employeeId: string, courseId: string, seconds: number): Promise<IEmployeeLearningRecord>;
  saveNotes(employeeId: string, courseId: string, notes: string): Promise<ICourseProgress>
  getResources(courseId: string): Promise<ICourseResource[]>
  getProgress(employeeId: string): Promise<ICourseProgress[] | null>
  getLearningRecords(employeeId: string): Promise<IEmployeeLearningRecord[]>
}
