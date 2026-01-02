import { ICourse, IModule } from '../../../../models/Course';
import { CourseCreateDTO } from '../../../../core/dtos/teacher/TeacherDTO';
import { ICourseResource } from '../../../../models/CourseResource';
import { CreateCourseRequest } from '../../../../types/filter/fiterTypes';

export interface ICourseWithStats extends ICourse {
  enrolledStudents: number;
  rating: number;
  reviewCount: number;
  completionRate: number;
}

export interface IRevenueData {
  _id: {
    year: number;
    month: number;
  };
  revenue: number;
}

export interface ILessonStat {
  _id: string; // lessonId
  count: number;
}

export interface IRatingStat {
  _id: number; // rating (1-5)
  count: number;
}

export interface ICourseAnalytics {
  overview: {
    title: string;
    totalStudents: number;
    individualEnrollments: number;
    companyEnrollments: number;
    totalRevenue: number;
    averageRating: number;
    reviewCount: number;
    completionRate: number;
    studentsCompleted: number;
  };
  revenueChart: IRevenueData[];
  lessonStats: ILessonStat[];
  ratingStats: IRatingStat[];
  courseStructure: IModule[]; // modules/lessons structure
}

export interface ITeacherCourseService {
  createCourse(req: CreateCourseRequest): Promise<CourseCreateDTO>;
  getCoursesByTeacherId(teacherId: string): Promise<ICourseWithStats[]>;
  getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<ICourse | null>;
  uploadResource(courseId: string, title: string, file: Express.Multer.File): Promise<ICourseResource>;
  deleteResource(resourceId: string): Promise<void>;
  getResources(courseId: string): Promise<ICourseResource[]>;
  editCourse(courseId: string, teacherId: string, updates: CreateCourseRequest): Promise<ICourse | null>;
  getCourseAnalytics(courseId: string, teacherId: string): Promise<ICourseAnalytics>;
}
