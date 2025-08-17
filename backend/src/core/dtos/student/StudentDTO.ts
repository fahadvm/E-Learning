// src/core/dto/student/studentProfileDto.ts
import { IStudent } from "../../../models/Student";

export const studentProfileDto = (student: IStudent) => ({
  _id: student._id.toString(),
  name: student.name,
  email: student.email,
  about: student.about,
  phone: student.phone,
  profilePicture: student.profilePicture,
  role: student.role,
  isVerified: student.isVerified,
  isBlocked: student.isBlocked,
  googleUser: student.googleUser,
  social_links: student.social_links,
});
