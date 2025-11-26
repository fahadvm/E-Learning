// core/dtos/admin/Admin.teacher.Dto.ts
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

// simple mapper
export const adminTeacherDto = (t: any): IAdminTeacherDTO => ({
  _id: t._id?.toString(),
  name: t.name,
  email: t.email,
  bio: t.about,
  avatar: t.profilePicture || t.avatar || '',
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

export const adminTeacherDetailsDto = (payload: { teacher: any; courses: any[] }) => {
  const { teacher, courses } = payload;
  return {
    teacher: adminTeacherDto(teacher),
    courses: courses.map((c: any) => ({
      _id: c._id?.toString(),
      title: c.title,
      thumbnail: c.coverImage || c.thumbnail || '',
      category: c.category,
      price: c.price ?? 0,
      rating: c.rating ?? 0,
      studentsEnrolled: c.totalStudents ?? 0,
      status: c.status ?? 'published',
    })),
    
  };
};
