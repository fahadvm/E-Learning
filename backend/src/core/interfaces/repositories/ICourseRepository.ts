import { ICourse } from '../../../models/course';
import { FilterQuery, SortOrder } from 'mongoose';

export interface ICourseRepository {
  create(courseData: Partial<ICourse>): Promise<ICourse>;
  findByTeacherId(teacherId: string): Promise<ICourse[]>;
  findByIdAndTeacherId(courseId: string, teacherId: string): Promise<ICourse | null>;
findAllCourses(
    query: FilterQuery<ICourse>,
    sort: Record<string, SortOrder>,
    skip: number,
    limit: number
  ): Promise<ICourse[]>;
  countAllCourses(query: string): Promise<number>;
  findCourseById(courseId: string): Promise<ICourse | null>;
  findAll(params: { skip: number; limit: number; search?: string }): Promise<ICourse[]>;
  count(search?: string): Promise<number>;
  findUnverified(): Promise<ICourse[]>;
  findById(courseId: string): Promise<ICourse | null>;
  updateStatus(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null>;
}
