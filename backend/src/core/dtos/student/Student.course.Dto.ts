import { ICourse, ILesson, IModule , } from '../../../models/course';
// Request DTO for filtering courses

export interface GetStudentCoursesRequestDTO {
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}




export interface IStudentLessonDTO {
  title: string;
  content?: string;
  videoUrl?: string;
}

export interface IStudentModuleDTO {
  title: string;
  description?: string;
  lessons: IStudentLessonDTO[];
}

export interface IStudentCourseDTO {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price?: string;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  teacherId?: string;
  modules: IStudentModuleDTO[];
  createdAt: Date;
  updatedAt: Date;
}
export interface PaginatedCourseDTO {
  data: IStudentCourseDTO[];
  total: number;
  totalPages:number;
}


export const StudentLessonDTO = (lesson: ILesson): IStudentLessonDTO => ({
  title: lesson.title,
  content: lesson.content,
  videoUrl: lesson.videoUrl,
});

export const StudentModuleDTO = (module: IModule): IStudentModuleDTO => ({
  title: module.title,
  description: module.description,
  lessons: module.lessons?.map(StudentLessonDTO) || [],
});

export const StudentCourseDTO = (course: ICourse): IStudentCourseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  description: course.description,
  level: course.level,
  category: course.category,
  price: course.price,
  coverImage: course.coverImage,
  isBlocked: course.isBlocked,
  isVerified: course.isVerified,
  status: course.status as 'pending' | 'verified' | 'rejected',
  rejectionReason: course.rejectionReason,
  teacherId: course.teacherId?.toString(),
  modules: course.modules?.map(StudentModuleDTO) || [],
  createdAt: course.createdAt!,
  updatedAt: course.updatedAt!,
});

