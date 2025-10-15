// src/services/student/student.course.service.ts
import { injectable, inject } from 'inversify';
import { IStudentCourseService } from '../../core/interfaces/services/student/IStudentCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IStudentCourseDTO, StudentCourseDTO, PaginatedCourseDTO, GetStudentCoursesRequestDTO } from '../../core/dtos/student/Student.course.Dto';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import { ICourseProgress } from '../../models/Student';
import { ICourseResource } from '../../models/CourseResource';
import { ICourseResourceRepository } from '../../core/interfaces/repositories/ICourseResourceRepository';

@injectable()
export class StudentCourseService implements IStudentCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository,
    @inject(TYPES.StudentRepository) private readonly _studentRepo: IStudentRepository) { }

  async getAllCourses(filters: GetStudentCoursesRequestDTO): Promise<PaginatedCourseDTO> {
    const { search, category, level, language, sort, order, page, limit } = filters;

    const query: any = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (level) query.level = level;
    if (language) query.language = language;

    const skip = (page - 1) * limit;
    const sortQuery = { [sort]: order === 'asc' ? 1 : -1 };


    const courses = await this._courseRepo.findAllCourses(query, sortQuery, skip, limit);

    const total = await this._courseRepo.countAllCourses(query);

    const totalPages = Math.ceil(total / limit);

    return {
      data: courses.map(StudentCourseDTO),
      total,
      totalPages,
    };
  };


  async getCourseDetail(courseId: string): Promise<IStudentCourseDTO> {
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return StudentCourseDTO(course);
  }

  async markLessonComplete(
    studentId: string,
    courseId: string,
    lessonId: string
  ): Promise<ICourseProgress> {

    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND)
    const progress = await this._studentRepo.updateStudentProgress(studentId, courseId, lessonId);
    return progress
  }

  async saveNotes(studentId: string, courseId: string, notes: string): Promise<ICourseProgress> {
    if (!notes) notes = "// Write your thoughts or doubts here";
    if (!courseId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.NOT_FOUND);
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const saving = await this._studentRepo.saveNotes(studentId, courseId, notes);
    return saving
  }
  async getResources(courseId: string): Promise<ICourseResource[]> {
    return this._resourceRepository.getResourcesByCourse(courseId);
  }


}

