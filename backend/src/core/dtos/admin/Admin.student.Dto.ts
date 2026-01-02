

import { ICourseProgress, IStudent } from '../../../models/Student';
import { ICourse } from '../../../models/Course';
import { IOrder } from '../../../models/Order';

export interface IAdminStudentListDTO {
  _id: string;
  name: string;
  email: string;
  avatar: string | null;
  isBlocked: boolean;
  joinDate: string;
  coursesCount: number;
  totalSpent: number;
}

export interface IStudentCourseProgressDTO {
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  percentage: number;
  lastVisitedLesson?: string;
  notes: string;
}

export interface IAdminStudentDetailsDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string | null;
  status: 'active' | 'blocked';
  verified: boolean;
  joinDate: string;

  coursesEnrolled: number;
  totalSpent: number;



  coursesProgress: IStudentCourseProgressDTO[];

  courses: {
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
    status: 'completed' | 'in-progress';
  }[];

  purchases: {
    id: string;
    date: string;
    courseName: string;
    amount: number;
    status: string;
    invoiceId: string;
  }[];

  notes?: string;
}

// ----------------------------------------
// LIST MAPPER
// ----------------------------------------
export const adminStudentListDto = (student: IStudent & { courseCount?: number; totalSpent?: number }): IAdminStudentListDTO => {
  return {
    _id: student._id.toString(),
    name: student.name,
    email: student.email,
    avatar: student.profilePicture || null,
    isBlocked: student.isBlocked,
    joinDate: student.createdAt
      ? new Date(student.createdAt).toISOString().split('T')[0]
      : '',
    coursesCount: student.courseCount ?? 0,
    totalSpent: student.totalSpent ?? 0,
  };
};

// ----------------------------------------
// DETAILS MAPPER
// ----------------------------------------
export const adminStudentDetailsDto = (data: {
  student: IStudent;
  courses: ICourse[];
  purchases: IOrder[];
}): IAdminStudentDetailsDTO => {
  const student = data.student;

  return {
    _id: student._id.toString(),
    name: student.name,
    email: student.email,
    phone: student.phone,
    avatar: student.profilePicture || null,
    status: student.isBlocked ? 'blocked' : 'active',
    verified: student.isVerified,
    joinDate: student.createdAt
      ? new Date(student.createdAt).toISOString().split('T')[0]
      : '',

    // Corrected coursesProgress mapping
    coursesProgress: student.coursesProgress ? student.coursesProgress.map((c: ICourseProgress) => ({
      courseId: c.courseId.toString(),
      completedLessons: c.completedLessons.map((l) => l.toString()),
      completedModules: c.completedModules.map((m) => m.toString()),
      percentage: c.percentage,
      lastVisitedLesson: c.lastVisitedLesson?.toString(),
      notes: c.notes || '',
    })) : [],

    coursesEnrolled: data.courses.length,
    totalSpent: data.purchases.reduce((sum, p) => sum + p.amount, 0),

    courses: (data.courses as (ICourse & { progress?: number; lastAccessed?: string; status?: string })[]).map((c) => ({
      id: c._id.toString(),
      title: c.title,
      progress: c.progress ?? 0,
      lastAccessed: c.lastAccessed || '',
      status: (c as unknown as { status: string }).status === 'completed' ? 'completed' : 'in-progress',
    })),

    purchases: data.purchases.map((p) => ({
      id: p._id.toString(),
      date: new Date(p.createdAt).toISOString().split('T')[0],
      courseName: (p.courses?.[0] as unknown as ICourse)?.title ?? 'N/A',
      amount: p.amount,
      status: p.status,
      invoiceId: p.razorpayOrderId,
    })),

    notes: student.notes ?? '',
  };
};
