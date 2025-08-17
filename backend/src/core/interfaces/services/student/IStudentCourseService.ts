import { ICourse } from '../../../../models/course';

export interface IStudentCourseService {
  getAllCourses(): Promise<ICourse[]>;  
  getCourseDetail(courseId: string): Promise<ICourse | null>;
}