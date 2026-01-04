"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyCourseDTO = exports.CompanyModuleDTO = exports.CompanyLessonDTO = void 0;
const CompanyLessonDTO = (lesson) => ({
    title: lesson.title,
    content: lesson.description,
    duration: lesson.duration
});
exports.CompanyLessonDTO = CompanyLessonDTO;
const CompanyModuleDTO = (module) => {
    var _a;
    return ({
        title: module.title,
        description: module.description,
        lessons: ((_a = module.lessons) === null || _a === void 0 ? void 0 : _a.map(exports.CompanyLessonDTO)) || [],
    });
};
exports.CompanyModuleDTO = CompanyModuleDTO;
const CompanyCourseDTO = (course) => {
    var _a, _b;
    return ({
        _id: course._id.toString(),
        title: course.title,
        description: course.description,
        level: course.level,
        category: course.category,
        price: course.price,
        coverImage: course.coverImage,
        isBlocked: course.isBlocked,
        isVerified: course.isVerified,
        status: course.status,
        adminRemarks: course.adminRemarks,
        teacherId: course.teacherId && typeof course.teacherId === 'object'
            ? {
                _id: course.teacherId._id.toString(),
                name: course.teacherId.name,
                email: course.teacherId.email,
                profilePicture: course.teacherId.profilePicture,
            }
            : undefined,
        modules: ((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map(exports.CompanyModuleDTO)) || [],
        learningOutcomes: course.learningOutcomes || [],
        requirements: course.requirements || [],
        totalDuration: (_b = course.totalDuration) !== null && _b !== void 0 ? _b : undefined,
        reviewCount: course.reviewCount,
        averageRating: course.averageRating,
        language: course.language,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
    });
};
exports.CompanyCourseDTO = CompanyCourseDTO;
