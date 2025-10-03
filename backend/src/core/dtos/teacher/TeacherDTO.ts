// src/core/dto/teacher/teacherProfileDto.ts
import { ITeacher } from '../../../models/Teacher';
import mongoose from 'mongoose';

export const teacherProfileDto = (teacher: ITeacher) => ({
  _id: teacher._id.toString(),
  name: teacher.name,
  email: teacher.email,
  role: teacher.role,
  isVerified: teacher.isVerified,
  isRejected: teacher.isRejected,
  isBlocked: teacher.isBlocked,
  googleUser: teacher.googleUser,
  about: teacher.about,
  profilePicture: teacher.profilePicture,
  location: teacher.location,
  phone: teacher.phone,
  website: teacher.website,
  social_links: teacher.social_links,
  education: teacher.education,
  experiences: teacher.experiences,
  skills: teacher.skills,
  review: teacher.review,
  comment: teacher.comment,
  rating: teacher.rating,
  userId: teacher.userId,
});

export interface LessonDTO {
  title: string;
  description?: string;
  duration?: number;
  videoFile?: string | undefined;   
  thumbnail?: string | undefined;   
}

export interface ModuleDTO {
  title: string;
  lessons: LessonDTO[];
}

export interface CourseCreateDTO {
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level: string;
  totalDuration?:number | undefined;
  coverImage?: string;
  language: string;
  price?: number;
  learningOutcomes?: string[];
  requirements?: string[];
  isPublished: boolean;
  modules: ModuleDTO[];
  teacherId?: mongoose.Types.ObjectId;
}

