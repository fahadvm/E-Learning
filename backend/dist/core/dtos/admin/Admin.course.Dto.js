"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCourseDTO = exports.AdminModuleDTO = exports.AdminLessonDTO = void 0;
const AdminLessonDTO = (lesson) => ({
    title: lesson.title,
    description: lesson.description,
    videoFile: lesson.videoFile,
    thumbnail: lesson.thumbnail,
    duration: lesson.duration,
});
exports.AdminLessonDTO = AdminLessonDTO;
const AdminModuleDTO = (module) => {
    var _a;
    return ({
        title: module.title,
        description: module.description,
        lessons: ((_a = module.lessons) === null || _a === void 0 ? void 0 : _a.map(exports.AdminLessonDTO)) || [],
    });
};
exports.AdminModuleDTO = AdminModuleDTO;
const AdminCourseDTO = (course) => {
    var _a;
    return ({
        _id: course._id.toString(),
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        level: course.level,
        category: course.category,
        language: course.language,
        price: course.price || 0,
        coverImage: course.coverImage,
        isBlocked: course.isBlocked,
        isVerified: course.isVerified,
        isPublished: course.isPublished,
        status: course.status,
        rejectionReason: course.rejectionReason,
        teacherId: course.teacherId,
        totalDuration: course.totalDuration,
        requirements: course.requirements || [],
        learningOutcomes: course.learningOutcomes || [],
        totalStudents: course.totalStudents || 0,
        modules: ((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map(exports.AdminModuleDTO)) || [],
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
    });
};
exports.AdminCourseDTO = AdminCourseDTO;
