import { GetStudentCoursesRequestDTO, IStudentCourseDTO ,PaginatedCourseDTO} from '../../../../core/dtos/student/Student.course.Dto';

export interface IStudentCourseService {
  getAllCourses(filters: GetStudentCoursesRequestDTO): Promise<PaginatedCourseDTO>;
  getCourseDetail(courseId: string): Promise<IStudentCourseDTO>;
   markLessonComplete(
    studentId: string,
    courseId: string,
    moduleIndex: number,
    lessonIndex: number
  ): Promise<{
    ok: boolean;
    message?: string;
    data?: any;
  }>;
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