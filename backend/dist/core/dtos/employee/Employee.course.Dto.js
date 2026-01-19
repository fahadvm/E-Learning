"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeFullCourseDTO = exports.EmployeeFullModuleDTO = exports.EmployeeFullLessonDTO = exports.EmployeeCourseDTO = exports.EmployeeModuleDTO = exports.EmployeeLessonDTO = void 0;
// --- Mappers ---
const EmployeeLessonDTO = (lesson) => {
    var _a;
    return ({
        _id: (_a = lesson._id) === null || _a === void 0 ? void 0 : _a.toString(),
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
    });
};
exports.EmployeeLessonDTO = EmployeeLessonDTO;
const EmployeeModuleDTO = (module) => {
    var _a, _b;
    return ({
        _id: (_a = module._id) === null || _a === void 0 ? void 0 : _a.toString(),
        title: module.title,
        description: module.description,
        lessons: ((_b = module.lessons) === null || _b === void 0 ? void 0 : _b.map(exports.EmployeeLessonDTO)) || [],
    });
};
exports.EmployeeModuleDTO = EmployeeModuleDTO;
const EmployeeCourseDTO = (course) => {
    var _a;
    return ({
        _id: course._id.toString(),
        title: course.title,
        subtitle: course.subtitle,
        description: course.description,
        level: course.level,
        category: course.category,
        language: course.language,
        coverImage: course.coverImage,
        totalDuration: course.totalDuration,
        modules: ((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map(exports.EmployeeModuleDTO)) || [],
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
    });
};
exports.EmployeeCourseDTO = EmployeeCourseDTO;
const EmployeeFullLessonDTO = (lesson) => (Object.assign(Object.assign({}, (0, exports.EmployeeLessonDTO)(lesson)), { videoFile: lesson.videoFile, thumbnail: lesson.thumbnail }));
exports.EmployeeFullLessonDTO = EmployeeFullLessonDTO;
const EmployeeFullModuleDTO = (module) => {
    var _a, _b;
    return ({
        _id: (_a = module._id) === null || _a === void 0 ? void 0 : _a.toString(),
        title: module.title,
        description: module.description,
        lessons: ((_b = module.lessons) === null || _b === void 0 ? void 0 : _b.map(exports.EmployeeFullLessonDTO)) || [],
    });
};
exports.EmployeeFullModuleDTO = EmployeeFullModuleDTO;
const EmployeeFullCourseDTO = (course) => {
    var _a;
    return (Object.assign(Object.assign({}, (0, exports.EmployeeCourseDTO)(course)), { modules: ((_a = course.modules) === null || _a === void 0 ? void 0 : _a.map(exports.EmployeeFullModuleDTO)) || [] }));
};
exports.EmployeeFullCourseDTO = EmployeeFullCourseDTO;
