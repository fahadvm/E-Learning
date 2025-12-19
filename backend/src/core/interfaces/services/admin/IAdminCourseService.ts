// src/services/interfaces/IAdminCourseService.ts
import { IAdminCourseDTO, PaginatedCourseDTO } from '../../../../core/dtos/admin/Admin.course.Dto';

export interface IAdminCourseService {
  getAllCourses(page: number, limit: number, search?: string): Promise<PaginatedCourseDTO>;
  getUnverifiedCourses(): Promise<IAdminCourseDTO[]>;
  getCourseById(courseId: string): Promise<IAdminCourseDTO | null>;
  verifyCourse(courseId: string): Promise<IAdminCourseDTO | null>;
  rejectCourse(courseId: string): Promise<IAdminCourseDTO | null>;
  blockCourse(courseId: string, reason: string): Promise<IAdminCourseDTO | null>;
  unblockCourse(courseId: string): Promise<IAdminCourseDTO | null>;
}
