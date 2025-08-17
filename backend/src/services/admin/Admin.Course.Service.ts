// src/services/AdminCourseService.ts
import { inject, injectable } from 'inversify';
import { IAdminCourseService } from '../../core/interfaces/services/admin/IAdminCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/course/ICourseRepository';
import { ICourse } from '../../models/course';
import { TYPES } from '../../core/di/types';

@injectable()
export class AdminCourseService implements IAdminCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository
  ) {}

  async getAllCourses(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this._courseRepo.findAll({ skip, limit, search }),
      this._courseRepo.count(search)
    ]);
    return { data, total };
  }

  async getUnverifiedCourses(): Promise<ICourse[]> {
    return this._courseRepo.findUnverified();
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
    return this._courseRepo.findById(courseId);
  }

  async verifyCourse(courseId: string): Promise<ICourse | null> {
    return this._courseRepo.updateStatus(courseId, { status: 'verified' });
  }

  async rejectCourse(courseId: string): Promise<ICourse | null> {
    return this._courseRepo.updateStatus(courseId, { status: 'rejected' });
  }

  async blockCourse(courseId: string): Promise<ICourse | null> {
    return this._courseRepo.updateStatus(courseId, { isBlocked: true });
  }

  async unblockCourse(courseId: string): Promise<ICourse | null> {
    return this._courseRepo.updateStatus(courseId, { isBlocked: false });
  }
}
