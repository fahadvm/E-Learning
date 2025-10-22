// src/core/dtos/admin/AdminTeacher.dto.ts
import { ITeacher, Education, Experience, SocialLinks } from '../../../models/Teacher';

export interface AdminEducationDTO {
  degree: string;
  description: string;
  from: string;
  to: string;
  institution: string;
}

export interface AdminExperienceDTO {
  company: string;
  title: string;
  type: string;
  location: string;
  from: string;
  to: string;
  duration: string;
  description: string;
}

export interface AdminSocialLinksDTO {
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface IAdminTeacherDTO {
  _id: string;
  name: string;
  email: string;
  verificationStatus: string;
  isRejected: boolean;
  isBlocked: boolean;
  googleUser: boolean;
  role: string;
  profilePicture: string;
  about: string;
  location: string;
  phone: string;
  website: string;
  social_links: AdminSocialLinksDTO;
  education: AdminEducationDTO[];
  experiences: AdminExperienceDTO[];
  skills: string[];
  review?: string;
  comment?: string;
  rating?: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedTeacherDTO {
  data: IAdminTeacherDTO[];
  total: number;
  totalPages: number;
}

// Mappers
export const mapEducationDTO = (edu: Education): AdminEducationDTO => ({ ...edu });
export const mapExperienceDTO = (exp: Experience): AdminExperienceDTO => ({ ...exp });
export const mapSocialLinksDTO = (links: SocialLinks): AdminSocialLinksDTO => ({ ...links });

export const adminTeacherDto = (teacher: ITeacher): IAdminTeacherDTO => ({
  _id: teacher._id.toString(),
  name: teacher.name,
  email: teacher.email,
  verificationStatus: teacher.verificationStatus,
  isRejected: teacher.isRejected,
  isBlocked: teacher.isBlocked,
  googleUser: teacher.googleUser,
  role: teacher.role,
  profilePicture: teacher.profilePicture,
  about: teacher.about,
  location: teacher.location,
  phone: teacher.phone,
  website: teacher.website,
  social_links: mapSocialLinksDTO(teacher.social_links),
  education: teacher.education?.map(mapEducationDTO) || [],
  experiences: teacher.experiences?.map(mapExperienceDTO) || [],
  skills: teacher.skills,
  review: teacher.review,
  comment: teacher.comment,
  rating: teacher.rating,
  userId: teacher.userId,
  createdAt: teacher.createdAt!,
  updatedAt: teacher.updatedAt!,
});
