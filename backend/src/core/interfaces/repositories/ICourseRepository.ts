import { FilterQuery, SortOrder } from 'mongoose';
import { ICourse } from '../../../models/Course';
import { CourseQuery } from '../../../types/filter/fiterTypes';

export interface ICourseRepository {
  create(courseData: Partial<ICourse>): Promise<ICourse>;
  findByTeacherId(teacherId: string): Promise<ICourse[]>;
  getFilteredCourses(
    filters: {
      search?: string;
      category?: string;
      level?: string;
      language?: string;
      sort?: string;
      order?: 'asc' | 'desc';
      page?: number;
      limit?: number;
      isBlocked?: boolean;
      isPublished?: boolean;
    }
  ): Promise<{ data: ICourse[]; totalPages: number; totalCount: number }>;
  findByIdAndTeacherId(courseId: string, teacherId: string): Promise<ICourse | null>;
  findAllCourses(
    query: FilterQuery<ICourse>,
    sort: Record<string, SortOrder>,
    skip: number,
    limit: number
  ): Promise<ICourse[]>
  findRecommendedCourses(
    courseId: string,
    category: string,
    level: string,
    limit: number
  ): Promise<ICourse[]>
  countAllCourses(query: CourseQuery): Promise<number>;
  findCourseById(courseId: string): Promise<ICourse | null>;
  findAll(params: { skip: number; limit: number; search?: string }): Promise<ICourse[]>;
  count(search?: string): Promise<number>;
  findUnverified(): Promise<ICourse[]>;
  findById(courseId: string): Promise<ICourse | null>;
  updateStatus(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null>;
  getPremiumCourses(): Promise<ICourse[]>;
  incrementStudentCount(courseId: string): Promise<void>;
  editCourse(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null>;
}
