import { ICourseProgress, IStudent } from '../../../models/Student';

// Define course progress interface
export interface ICourseProgressDTO {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
}

export interface IStudentProfileDTO {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isPremium: boolean;
  isBlocked: boolean;
  role: string;
  googleUser: boolean;
  profilePicture?: string;
  about?: string;
  phone?: string;
  social_links?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  planName?: string;
  planStatus?: string;
  coursesProgress?: ICourseProgressDTO[];
}

export const studentProfileDto = (student: IStudent, planName?: string, planStatus?: string): IStudentProfileDTO => ({
  _id: student._id.toString(),
  name: student.name,
  email: student.email,
  about: student.about,
  phone: student.phone,
  profilePicture: student.profilePicture,
  role: student.role,
  isVerified: student.isVerified,
  isPremium: student.isPremium,
  isBlocked: student.isBlocked,
  googleUser: student.googleUser,
  social_links: student.social_links,
  planName: planName,
  planStatus: planStatus,
  coursesProgress: student.coursesProgress
    ? student.coursesProgress.map((progress: ICourseProgress) => ({
      courseId: progress.courseId?.toString(),
      completedLessons: progress.completedLessons?.map((l: string) => l.toString()) || [],
      completedModules: progress.completedModules?.map((m: string) => m.toString()) || [],
      percentage: progress.percentage || 0,
      lastVisitedLesson: progress.lastVisitedLesson?.toString(),
    }))
    : [],
});
