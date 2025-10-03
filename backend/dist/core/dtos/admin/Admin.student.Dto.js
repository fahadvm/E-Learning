"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStudentDto = void 0;
const adminStudentDto = (student) => ({
    _id: student._id.toString(),
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
exports.adminStudentDto = adminStudentDto;
