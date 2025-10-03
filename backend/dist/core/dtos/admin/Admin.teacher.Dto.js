"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTeacherDto = exports.mapSocialLinksDTO = exports.mapExperienceDTO = exports.mapEducationDTO = void 0;
// Mappers
const mapEducationDTO = (edu) => (Object.assign({}, edu));
exports.mapEducationDTO = mapEducationDTO;
const mapExperienceDTO = (exp) => (Object.assign({}, exp));
exports.mapExperienceDTO = mapExperienceDTO;
const mapSocialLinksDTO = (links) => (Object.assign({}, links));
exports.mapSocialLinksDTO = mapSocialLinksDTO;
const adminTeacherDto = (teacher) => {
    var _a, _b;
    return ({
        _id: teacher._id.toString(),
        name: teacher.name,
        email: teacher.email,
        isVerified: teacher.isVerified,
        isRejected: teacher.isRejected,
        isBlocked: teacher.isBlocked,
        googleUser: teacher.googleUser,
        role: teacher.role,
        profilePicture: teacher.profilePicture,
        about: teacher.about,
        location: teacher.location,
        phone: teacher.phone,
        website: teacher.website,
        social_links: (0, exports.mapSocialLinksDTO)(teacher.social_links),
        education: ((_a = teacher.education) === null || _a === void 0 ? void 0 : _a.map(exports.mapEducationDTO)) || [],
        experiences: ((_b = teacher.experiences) === null || _b === void 0 ? void 0 : _b.map(exports.mapExperienceDTO)) || [],
        skills: teacher.skills,
        review: teacher.review,
        comment: teacher.comment,
        rating: teacher.rating,
        userId: teacher.userId,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
    });
};
exports.adminTeacherDto = adminTeacherDto;
