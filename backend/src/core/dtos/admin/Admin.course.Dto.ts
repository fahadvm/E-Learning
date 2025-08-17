import { ICourse, ILesson, IModule , } from "../../../models/course";

export interface IAdminLessonDTO {
  title: string;
  content?: string;
  videoUrl?: string;
}

export interface IAdminModuleDTO {
  title: string;
  description?: string;
  lessons: IAdminLessonDTO[];
}

export interface IAdminCourseDTO {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price?: string;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  status: "pending" | "verified" | "rejected";
  rejectReason?: string;
  teacherId?: string;
  modules: IAdminModuleDTO[];
  createdAt: Date;
  updatedAt: Date;
}
export interface PaginatedCourseDTO {
  data: IAdminCourseDTO[];
  total: number;
  totalPages:number;
}


export const AdminLessonDTO = (lesson: ILesson): IAdminLessonDTO => ({
  title: lesson.title,
  content: lesson.content,
  videoUrl: lesson.videoUrl,
});

export const AdminModuleDTO = (module: IModule): IAdminModuleDTO => ({
  title: module.title,
  description: module.description,
  lessons: module.lessons?.map(AdminLessonDTO) || [],
});

export const AdminCourseDTO = (course: ICourse): IAdminCourseDTO => ({
  id: course._id.toString(),
  title: course.title,
  description: course.description,
  level: course.level,
  category: course.category,
  price: course.price,
  coverImage: course.coverImage,
  isBlocked: course.isBlocked,
  isVerified: course.isVerified,
  status: course.status as "pending" | "verified" | "rejected",
  rejectReason: course.rejectReason,
  teacherId: course.teacherId?.toString(),
  modules: course.modules?.map(AdminModuleDTO) || [],
  createdAt: course.createdAt!,
  updatedAt: course.updatedAt!,
});

