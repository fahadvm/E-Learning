"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentCartDto = void 0;
const studentCartDto = (courses, total) => ({
    courses: courses.map((course) => {
        var _a;
        return ({
            id: course._id.toString(),
            title: course.title,
            price: course.price ? Number(course.price) : 0,
            coverImage: course.coverImage,
            teacherId: (_a = course.teacherId) === null || _a === void 0 ? void 0 : _a.toString(),
        });
    }),
    total,
});
exports.studentCartDto = studentCartDto;
