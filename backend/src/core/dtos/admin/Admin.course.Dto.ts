import { ITeacher } from '@/models/Teacher';
import { ILesson, IModule, ICourse } from '../../../models/course';
import mongoose from 'mongoose';

export interface IAdminLessonDTO {
  title: string;
  description?: string;
  videoFile?: string;
  thumbnail?: string;
  duration?: number;
}

export interface IAdminModuleDTO {
  title: string;
  description?: string;
  lessons: IAdminLessonDTO[];
}

export interface IAdminCourseDTO {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  level: string;
  category: string;
  language: string;
  price?: number;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  isPublished: boolean;
  status: string; // can restrict later if needed
  rejectionReason?: string;
  teacherId?: mongoose.Types.ObjectId | ITeacher; // <-- STRICT union type
  duration?: number;
  requirements?: string[];
  learningOutcomes?: string[];
  totalStudents?: number;
  modules: IAdminModuleDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedCourseDTO {
  data: IAdminCourseDTO[];
  total: number;
  totalPages: number;
}


export const AdminLessonDTO = (lesson: ILesson): IAdminLessonDTO => ({
  title: lesson.title,
  description: lesson.description,
  videoFile: lesson.videoFile,
  thumbnail: lesson.thumbnail,
  duration: lesson.duration,
});

export const AdminModuleDTO = (module: IModule): IAdminModuleDTO => ({
  title: module.title,
  description: module.description,
  lessons: module.lessons?.map(AdminLessonDTO) || [],
});

export const AdminCourseDTO = (course: ICourse): IAdminCourseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  subtitle: course.subtitle,
  description: course.description,
  level: course.level,
  category: course.category,
  language: course.language,
  price: course.price || 0,
  coverImage: course.coverImage,
  isBlocked: course.isBlocked,
  isVerified: course.isVerified,
  isPublished: course.isPublished,
  status: course.status,
  rejectionReason: course.rejectionReason,
  teacherId: course.teacherId as mongoose.Types.ObjectId | ITeacher, 
  duration: course.duration,
  requirements: course.requirements || [],
  learningOutcomes: course.learningOutcomes || [],
  totalStudents: course.totalStudents || 0,
  modules: course.modules?.map(AdminModuleDTO) || [],
  createdAt: course.createdAt!,
  updatedAt: course.updatedAt!,
});

