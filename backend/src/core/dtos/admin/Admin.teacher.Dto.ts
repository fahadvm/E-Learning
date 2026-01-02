import { ITeacher } from '../../../models/Teacher';
import { ICourse } from '../../../models/Course';

export interface IAdminTeacherDTO {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  isBlocked: boolean;
  verificationStatus: string;
  verificationReason?: string;
  resumeUrl?: string;
  phone?: string;
  joinDate?: string;
  totalCourses?: number;
  totalStudents?: number;
  totalEarnings?: number;
  verified?: boolean;
  skills: string[]
}

export interface PaginatedTeacherDTO {
  data: IAdminTeacherDTO[];
  total: number;
  totalPages: number;
}

export interface IAdminTeacherDetailsDTO {
  teacher: IAdminTeacherDTO;
  courses: {
    _id: string;
    title: string;
    thumbnail: string;
    category: string;
    price: number;
    rating: number;
    totalStudents: number;
    status: string;
  }[];
}

// simple mapper
export const adminTeacherDto = (t: ITeacher & { totalCourses?: number; totalStudents?: number; totalEarnings?: number }): IAdminTeacherDTO => ({
  _id: t._id?.toString(),
  name: t.name,
  email: t.email,
  bio: t.about || '',
  avatar: t.profilePicture || '',
  isBlocked: !!t.isBlocked,
  verificationStatus: t.verificationStatus,
  verificationReason: t.verificationReason || '',
  resumeUrl: t.resumeUrl || '',
  phone: t.phone || '',
  joinDate: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '',
  totalCourses: t.totalCourses ?? 0,
  totalStudents: t.totalStudents ?? 0,
  totalEarnings: t.totalEarnings ?? 0,
  verified: t.verificationStatus === 'verified',
  skills: Array.isArray(t.skills) ? t.skills : [],
});

export const adminTeacherDetailsDto = (payload: { teacher: ITeacher; courses: ICourse[] }): IAdminTeacherDetailsDTO => {
  const { teacher, courses } = payload;
  return {
    teacher: adminTeacherDto(teacher as ITeacher & { totalCourses?: number; totalStudents?: number; totalEarnings?: number }),
    courses: courses.map((c) => ({
      _id: c._id?.toString() || '',
      title: c.title,
      thumbnail: c.coverImage || '',
      category: typeof c.category === 'object' && c.category !== null && 'name' in c.category
        ? (c.category as { name: string }).name
        : String(c.category || ''),
      price: c.price ?? 0,
      rating: (c as unknown as { averageRating: number }).averageRating ?? 0,
      totalStudents: c.totalStudents ?? 0,
      status: c.status ?? 'published',
    })),

  };
};
