// src/services/student/student.course.service.ts
import { injectable, inject } from 'inversify';
import { IStudentCourseService, CourseFilters } from '../../core/interfaces/services/student/IStudentCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IStudentCourseDTO, StudentCourseDTO, PaginatedCourseDTO, GetStudentCoursesRequestDTO } from '../../core/dtos/student/Student.course.Dto';

@injectable()
export class StudentCourseService implements IStudentCourseService {
  constructor(@inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository) { }

  async getAllCourses(filters: GetStudentCoursesRequestDTO): Promise<PaginatedCourseDTO> {
    const { search, category, level, language, sort, order, page, limit } = filters;

    const query: any = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (level) query.level = level;
    if (language) query.language = language;

    const skip = (page - 1) * limit;
    const sortQuery = { [sort]: order === "asc" ? 1 : -1 };

    console.log("query from service page", query)

    const courses = await this._courseRepo.findAllCourses(query, sortQuery, skip, limit);

    const total = await this._courseRepo.countAllCourses(query);

    const totalPages = Math.ceil(total / limit);

    return {
      data: courses.map(StudentCourseDTO),
      total,
      totalPages,
    }
  };


  async getCourseDetail(courseId: string):Promise<IStudentCourseDTO > {
  if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
  const course = await this._courseRepo.findById(courseId);
  if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
  return StudentCourseDTO(course);
}
}

