import { ICourse } from '../../../../models/Course';
import { ICourseResource } from '../../../../models/CourseResource';
import { ICourseProgress, IEmployee } from '../../../../models/Employee';
import { IEmployeeLearningRecord } from '../../../../models/EmployeeLearningRecord';
export interface IEmployeeCourseService {
  getMyCourses(employeeId: string): Promise<IEmployee | null>
  getMyCourseDetails(employeeId: string, courseId: string): Promise<{ course: ICourse; progress: ICourseProgress }>
  markLessonComplete(employeeId: string, courseId: string, lessonId: string): Promise<ICourseProgress>;
  addLearningTime(employeeId: string, courseId: string, seconds: number): Promise<IEmployeeLearningRecord>;
  saveNotes(employeeId: string, courseId: string, notes: string): Promise<ICourseProgress>
  getResources(courseId: string): Promise<ICourseResource[]>
  getProgress(employeeId: string): Promise<ICourseProgress[] | null>
  getLearningRecords(employeeId: string): Promise<IEmployeeLearningRecord[]>
}
