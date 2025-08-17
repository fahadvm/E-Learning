// src/core/dtos/admin/AdminStudent.dto.ts
import { IStudent } from "../../../models/Student";

export interface IAdminStudentDTO {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
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
}

export interface PaginatedStudentDTO {
  data: IAdminStudentDTO[];
  total: number;
  totalPages: number;
}

export const adminStudentDto = (student: IStudent): IAdminStudentDTO => ({
  id: student._id.toString(),
  name: student.name,
  email: student.email,
  isVerified: student.isVerified,
  isBlocked: student.isBlocked,
  role: student.role,
  googleUser: student.googleUser,
  profilePicture: student.profilePicture,
  about: student.about,
  phone: student.phone,
  social_links: student.social_links,
});
