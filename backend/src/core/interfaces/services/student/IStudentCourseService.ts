import { GetStudentCoursesRequestDTO, IStudentCourseDTO, PaginatedCourseDTO } from '../../../../core/dtos/student/Student.course.Dto';
import { ICourse } from '../../../../models/Course';
import { ICourseResource } from '../../../../models/CourseResource';
import { ICourseProgress } from '../../../../models/Student';

export interface IStudentCourseService {
  getAllCourses(filters: GetStudentCoursesRequestDTO): Promise<PaginatedCourseDTO>;
  getCourseDetail(courseId: string): Promise<ICourse>;
  markLessonComplete(studentId: string, courseId: string, lessonId: string): Promise<ICourseProgress>;
  saveNotes(studentId: string, courseId: string, notes: string): Promise<ICourseProgress>
  getResources(courseId: string): Promise<ICourseResource[]>

}

export interface CourseFilters {
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}

