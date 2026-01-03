import { ICourse, ILesson, IModule, } from '../../../models/Course';
import { ITeacher } from '../../../models/Teacher';
// Request DTO for filtering courses

export interface GetCompanyCoursesRequestDTO {
  search?: string;
  category?: string;
  level?: string;
  language?: string;
  sort: string;
  order: string;
  page: number;
  limit: number;
}




export interface ICompanyLessonDTO {
  title: string;
  content?: string;
  duration?: number;
}

export interface ICompanyModuleDTO {
  title: string;
  description?: string;
  lessons: ICompanyLessonDTO[];
}

export interface ICourseTeacherDTO {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface ICompanyCourseDTO {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price?: number;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  status: string;
  adminRemarks?: string;
  learningOutcomes: string[];
  requirements: string[];
  teacherId?: ICourseTeacherDTO;
  modules: ICompanyModuleDTO[];
  language: string;
  totalDuration: number | undefined;
  reviewCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface PaginatedCourseDTO {
  data: ICompanyCourseDTO[];
  totalCount: number;
  totalPages: number;
}


export const CompanyLessonDTO = (lesson: ILesson): ICompanyLessonDTO => ({
  title: lesson.title,
  content: lesson.description,
  duration: lesson.duration

});

export const CompanyModuleDTO = (module: IModule): ICompanyModuleDTO => ({
  title: module.title,
  description: module.description,
  lessons: module.lessons?.map(CompanyLessonDTO) || [],
});

export const CompanyCourseDTO = (course: ICourse): ICompanyCourseDTO => ({
  _id: course._id.toString(),
  title: course.title,
  description: course.description,
  level: course.level,
  category: course.category,
  price: course.price,
  coverImage: course.coverImage,
  isBlocked: course.isBlocked,
  isVerified: course.isVerified,
  status: course.status,
  adminRemarks: course.adminRemarks,
  teacherId: course.teacherId && typeof course.teacherId === 'object'
    ? {
      _id: (course.teacherId as ITeacher)._id.toString(),
      name: (course.teacherId as ITeacher).name,
      email: (course.teacherId as ITeacher).email,
      profilePicture: (course.teacherId as ITeacher).profilePicture,
    }
    : undefined,
  modules: course.modules?.map(CompanyModuleDTO) || [],
  learningOutcomes: course.learningOutcomes || [],
  requirements: course.requirements || [],
  totalDuration: course.totalDuration ?? undefined,
  reviewCount: course.reviewCount,
  averageRating: course.averageRating,
  language: course.language,
  createdAt: course.createdAt!,
  updatedAt: course.updatedAt!,
});

