import { inject, injectable } from 'inversify';
import { ICompanyCourseService } from '../../core/interfaces/services/company/ICompanyCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICourse } from '../../models/course';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';

@injectable()
export class CompanyCourseService implements ICompanyCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository
  ) {}

  async getAllCourses(): Promise<ICourse[]> {
    const courses = await this._courseRepository.findAllCourses();
    return courses;
  }

  async getCourseDetail(courseId: string): Promise<ICourse | null> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }
}
