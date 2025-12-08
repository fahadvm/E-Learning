"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminTeacherDetailsDto = exports.adminTeacherDto = void 0;
// simple mapper
const adminTeacherDto = (t) => {
    var _a, _b, _c, _d;
    return ({
        _id: (_a = t._id) === null || _a === void 0 ? void 0 : _a.toString(),
        name: t.name,
        email: t.email,
        bio: t.about,
        avatar: t.profilePicture || t.avatar || '',
        isBlocked: !!t.isBlocked,
        verificationStatus: t.verificationStatus,
        verificationReason: t.verificationReason || '',
        resumeUrl: t.resumeUrl || '',
        phone: t.phone || '',
        joinDate: t.createdAt ? new Date(t.createdAt).toISOString().split('T')[0] : '',
        totalCourses: (_b = t.totalCourses) !== null && _b !== void 0 ? _b : 0,
        totalStudents: (_c = t.totalStudents) !== null && _c !== void 0 ? _c : 0,
        totalEarnings: (_d = t.totalEarnings) !== null && _d !== void 0 ? _d : 0,
        verified: t.verificationStatus === 'verified',
        skills: Array.isArray(t.skills) ? t.skills : [],
    });
};
exports.adminTeacherDto = adminTeacherDto;
const adminTeacherDetailsDto = (payload) => {
    const { teacher, courses } = payload;
    return {
        teacher: (0, exports.adminTeacherDto)(teacher),
        courses: courses.map((c) => {
            var _a, _b, _c, _d, _e;
            return ({
                _id: (_a = c._id) === null || _a === void 0 ? void 0 : _a.toString(),
                title: c.title,
                thumbnail: c.coverImage || c.thumbnail || '',
                category: c.category,
                price: (_b = c.price) !== null && _b !== void 0 ? _b : 0,
                rating: (_c = c.rating) !== null && _c !== void 0 ? _c : 0,
                totalStudents: (_d = c.totalStudents) !== null && _d !== void 0 ? _d : 0,
                status: (_e = c.status) !== null && _e !== void 0 ? _e : 'published',
            });
        }),
    };
};
exports.adminTeacherDetailsDto = adminTeacherDetailsDto;
