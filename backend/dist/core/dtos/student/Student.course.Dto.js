"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentCourseDTO = exports.StudentModuleDTO = exports.StudentLessonDTO = void 0;
const StudentLessonDTO = (lesson) => ({
    title: lesson.title,
    content: lesson.description,
    videoUrl: lesson.videoFile,
});
exports.StudentLessonDTO = StudentLessonDTO;
const StudentModuleDTO = (module) => {
    var _a;
    return ({
        title: module.title,
        description: module.description,
        lessons: ((_a = module.lessons) === null || _a === void 0 ? void 0 : _a.map(exports.StudentLessonDTO)) || [],
    });
};
exports.StudentModuleDTO = StudentModuleDTO;
const StudentCourseDTO = (course) => {
    var _a, _b, _c;
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
        rejectionReason: course.rejectionReason,
        teacherId: (_a = course.teacherId) === null || _a === void 0 ? void 0 : _a.toString(),
        modules: ((_b = course.modules) === null || _b === void 0 ? void 0 : _b.map(exports.StudentModuleDTO)) || [],
        totalDuration: (_c = course.totalDuration) !== null && _c !== void 0 ? _c : undefined,
        language: course.language,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
    });
};
exports.StudentCourseDTO = StudentCourseDTO;
