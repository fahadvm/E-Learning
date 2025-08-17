// src/services/interfaces/IAdminCourseService.ts
import { ICourse } from '../../../../models/course';

export interface IAdminCourseService {
  getAllCourses(page: number, limit: number, search?: string): Promise<{ data: ICourse[]; total: number }>;
  getUnverifiedCourses(): Promise<ICourse[]>;
  getCourseById(courseId: string): Promise<ICourse | null>;
  verifyCourse(courseId: string): Promise<ICourse | null>;
  rejectCourse(courseId: string): Promise<ICourse | null>;
  blockCourse(courseId: string): Promise<ICourse | null>;
  unblockCourse(courseId: string): Promise<ICourse | null>;
}
