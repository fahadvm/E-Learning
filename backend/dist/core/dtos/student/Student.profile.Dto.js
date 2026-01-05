"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentProfileDto = void 0;
const studentProfileDto = (student, planName, planStatus) => ({
    _id: student._id.toString(),
    name: student.name,
    email: student.email,
    about: student.about,
    phone: student.phone,
    profilePicture: student.profilePicture,
    role: student.role,
    isVerified: student.isVerified,
    isPremium: student.isPremium,
    isBlocked: student.isBlocked,
    googleUser: student.googleUser,
    social_links: student.social_links,
    planName: planName,
    planStatus: planStatus,
    coursesProgress: student.coursesProgress
        ? student.coursesProgress.map((progress) => {
            var _a, _b, _c, _d;
            return ({
                courseId: (_a = progress.courseId) === null || _a === void 0 ? void 0 : _a.toString(),
                completedLessons: ((_b = progress.completedLessons) === null || _b === void 0 ? void 0 : _b.map((l) => l.toString())) || [],
                completedModules: ((_c = progress.completedModules) === null || _c === void 0 ? void 0 : _c.map((m) => m.toString())) || [],
                percentage: progress.percentage || 0,
                lastVisitedLesson: (_d = progress.lastVisitedLesson) === null || _d === void 0 ? void 0 : _d.toString(),
            });
        })
        : [],
});
exports.studentProfileDto = studentProfileDto;
