"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentProfileDto = void 0;
const studentProfileDto = (student) => ({
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
exports.studentProfileDto = studentProfileDto;
