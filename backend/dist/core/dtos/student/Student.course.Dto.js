"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasedCourseDTO = exports.PurchasedModuleDTO = exports.PurchasedLessonDTO = exports.StudentCourseDTO = exports.StudentModuleDTO = exports.StudentLessonDTO = void 0;
const StudentLessonDTO = (lesson) => ({
    title: lesson.title,
    content: lesson.description,
    duration: lesson.duration
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
        modules: ((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map(exports.StudentModuleDTO)) || [],
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
exports.StudentCourseDTO = StudentCourseDTO;
const PurchasedLessonDTO = (lesson) => {
    var _a;
    return ({
        _id: (_a = lesson._id) === null || _a === void 0 ? void 0 : _a.toString(),
        title: lesson.title,
        content: lesson.description,
        videoFile: lesson.videoFile,
        thumbnail: lesson.thumbnail,
        duration: lesson.duration
    });
};
exports.PurchasedLessonDTO = PurchasedLessonDTO;
const PurchasedModuleDTO = (module) => {
    var _a, _b;
    return ({
        _id: (_a = module._id) === null || _a === void 0 ? void 0 : _a.toString(),
        title: module.title,
        description: module.description,
        lessons: ((_b = module.lessons) === null || _b === void 0 ? void 0 : _b.map(exports.PurchasedLessonDTO)) || [],
    });
};
exports.PurchasedModuleDTO = PurchasedModuleDTO;
const PurchasedCourseDTO = (course) => {
    var _a;
    const base = (0, exports.StudentCourseDTO)(course);
    return Object.assign(Object.assign({}, base), { modules: ((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map(exports.PurchasedModuleDTO)) || [] });
};
exports.PurchasedCourseDTO = PurchasedCourseDTO;
