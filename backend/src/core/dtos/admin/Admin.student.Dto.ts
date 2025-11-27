

import { ICourseProgress } from "../../../models/Student";

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

export interface IAdminStudentDetailsDTO {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string | null;
  status: "active" | "blocked";
  verified: boolean;
  joinDate: string;

  coursesEnrolled: number;
  totalSpent: number;



  coursesProgress: ICourseProgress[]

  courses: {
    id: string;
    title: string;
    progress: number;
    lastAccessed: string;
    status: "completed" | "in-progress";
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
export const adminStudentListDto = (student: any): IAdminStudentListDTO => {
  return {
    _id: student._id.toString(),
    name: student.name,
    email: student.email,
    avatar: student.profilePicture || null,
    isBlocked: student.isBlocked,
    joinDate: student.createdAt
      ? new Date(student.createdAt).toISOString().split("T")[0]
      : "",
    coursesCount: student.courseCount ?? 0,
    totalSpent: student.totalSpent ?? 0,
  };
};

// ----------------------------------------
// DETAILS MAPPER
// ----------------------------------------
export const adminStudentDetailsDto = (data: {
  student: any;
  courses: any[];
  purchases: any[];
}): IAdminStudentDetailsDTO => {
  const student = data.student;

  return {
    _id: student._id.toString(),
    name: student.name,
    email: student.email,
    phone: student.phone,
    avatar: student.profilePicture || null,
    status: student.isBlocked ? "blocked" : "active",
    verified: student.isVerified,
    joinDate: student.createdAt
      ? new Date(student.createdAt).toISOString().split("T")[0]
      : "",

    // Corrected coursesProgress mapping
    coursesProgress: student.coursesProgress?student.coursesProgress.map((c: any) => ({
      courseId: c.courseId.toString(),
      completedLessons: c.completedLessons.map((l: any) => l.toString()),
      completedModules: c.completedModules.map((m: any) => m.toString()),
      percentage: c.percentage,
      lastVisitedLesson: c.lastVisitedLesson?.toString(),
      notes: c.notes || "",
    })):[],

    coursesEnrolled: data.courses.length,
    totalSpent: data.purchases.reduce((sum, p) => sum + p.amount, 0),

    courses: data.courses.map((c) => ({
      id: c._id.toString(),
      title: c.title,
      progress: c.progress ?? 0,
      lastAccessed: c.lastAccessed || "",
      status: c.status ?? "in-progress",
    })),

    purchases: data.purchases.map((p) => ({
      id: p._id.toString(),
      date: new Date(p.createdAt).toISOString().split("T")[0],
      courseName: p.courses?.[0]?.title ?? "N/A",
      amount: p.amount,
      status: p.status,
      invoiceId: p.razorpayOrderId,
    })),

    notes: student.notes ?? "",
  };
};
