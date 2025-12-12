import { ICourse, ILesson, IModule, } from '../../../models/Course';
import { ITeacher } from '../../../models/Teacher';
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
  duration?: number;
}

export interface IStudentModuleDTO {
  title: string;
  description?: string;
  lessons: IStudentLessonDTO[];
}

export interface ICourseTeacherDTO {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

export interface IStudentCourseDTO {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  price?: number;
  coverImage?: string;
  isBlocked: boolean;
  isVerified: boolean;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  learningOutcomes: string[];
  requirements: string[];
  teacherId?: ICourseTeacherDTO;
  modules: IStudentModuleDTO[];
  language: string;
  totalDuration: number | undefined;
  reviewCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface PaginatedCourseDTO {
  data: IStudentCourseDTO[];
  total: number;
  totalPages: number;
}


export const StudentLessonDTO = (lesson: ILesson): IStudentLessonDTO => ({
  title: lesson.title,
  content: lesson.description,
  duration: lesson.duration

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
  teacherId: course.teacherId && typeof course.teacherId === "object"
    ? {
      _id: (course.teacherId as ITeacher)._id.toString(),
      name: (course.teacherId as ITeacher).name,
      email: (course.teacherId as ITeacher).email,
      profilePicture: (course.teacherId as ITeacher).profilePicture,
    }
    : undefined,
  modules: course.modules?.map(StudentModuleDTO) || [],
  learningOutcomes: course.learningOutcomes || [],
  requirements: course.requirements || [],
  totalDuration: course.totalDuration ?? undefined,
  reviewCount: course.reviewCount,
  averageRating: course.averageRating,
  language: course.language,
  createdAt: course.createdAt!,
  updatedAt: course.updatedAt!,
});

