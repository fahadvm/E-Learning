import { inject, injectable } from 'inversify';
import { ITeacherCourseService } from '../../core/interfaces/services/teacher/ITeacherCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';

@injectable()
export class TeacherCourseService implements ITeacherCourseService {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly _courseRepository: ICourseRepository
  ) {}

  async createCourse(req: any): Promise<any> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const courseData = {
      ...req.body,
      teacherId,
    };

    const createdCourse = await this._courseRepository.create(courseData);
    if (!createdCourse) throwError(MESSAGES.COURSE_CREATED_FAILED, STATUS_CODES.BAD_REQUEST);

    return createdCourse;
  }

  async getCoursesByTeacherId(teacherId: string): Promise<any[]> {
    const courses = await this._courseRepository.findByTeacherId(teacherId);
    // if (!courses || courses.length === 0) {
    //   throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    // }
    return courses;
  }

  async getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<any> {
    const course = await this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }
}
