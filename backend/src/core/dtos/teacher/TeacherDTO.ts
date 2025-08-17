// src/core/dto/teacher/teacherProfileDto.ts
import { ITeacher } from "../../../models/Teacher";

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
