// src/services/student/student.course.service.ts
import { injectable, inject } from 'inversify';
import { IStudentCourseService } from '../../core/interfaces/services/student/IStudentCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { TYPES } from '../../core/DI/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class StudentCourseService implements IStudentCourseService {
  constructor(@inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository) {}

  async getAllCourses() {
    const courses = await this._courseRepo.findAllCourses();
    if (!courses || courses.length === 0) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return courses;
  }

  async getCourseDetail(courseId: string) {
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }
}
