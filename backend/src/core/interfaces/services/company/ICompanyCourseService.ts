import { ICourse } from '../../../../models/course';

export interface ICompanyCourseService {
  getAllCourses(): Promise<ICourse[]>;
  getCourseDetail(courseId: string): Promise<ICourse | null>;
}
