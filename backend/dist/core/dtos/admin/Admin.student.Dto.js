"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminStudentDetailsDto = exports.adminStudentListDto = void 0;
// ----------------------------------------
// LIST MAPPER
// ----------------------------------------
const adminStudentListDto = (student) => {
    var _a, _b;
    return {
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        avatar: student.profilePicture || null,
        isBlocked: student.isBlocked,
        joinDate: student.createdAt
            ? new Date(student.createdAt).toISOString().split("T")[0]
            : "",
        coursesCount: (_a = student.courseCount) !== null && _a !== void 0 ? _a : 0,
        totalSpent: (_b = student.totalSpent) !== null && _b !== void 0 ? _b : 0,
    };
};
exports.adminStudentListDto = adminStudentListDto;
// ----------------------------------------
// DETAILS MAPPER
// ----------------------------------------
const adminStudentDetailsDto = (data) => {
    var _a;
    const student = data.student;
    return {
        _id: student._id.toString(),
        name: student.name,
        email: student.email,
        phone: student.phone,
        avatar: student.profilePicture || null,
        status: student.isBlocked ? "blocked" : "active",
        verified: student.isVerified,
        joinDate: student.createdAt
            ? new Date(student.createdAt).toISOString().split("T")[0]
            : "",
        // Corrected coursesProgress mapping
        coursesProgress: student.coursesProgress ? student.coursesProgress.map((c) => {
            var _a;
            return ({
                courseId: c.courseId.toString(),
                completedLessons: c.completedLessons.map((l) => l.toString()),
                completedModules: c.completedModules.map((m) => m.toString()),
                percentage: c.percentage,
                lastVisitedLesson: (_a = c.lastVisitedLesson) === null || _a === void 0 ? void 0 : _a.toString(),
                notes: c.notes || "",
            });
        }) : [],
        coursesEnrolled: data.courses.length,
        totalSpent: data.purchases.reduce((sum, p) => sum + p.amount, 0),
        courses: data.courses.map((c) => {
            var _a, _b;
            return ({
                id: c._id.toString(),
                title: c.title,
                progress: (_a = c.progress) !== null && _a !== void 0 ? _a : 0,
                lastAccessed: c.lastAccessed || "",
                status: (_b = c.status) !== null && _b !== void 0 ? _b : "in-progress",
            });
        }),
        purchases: data.purchases.map((p) => {
            var _a, _b, _c;
            return ({
                id: p._id.toString(),
                date: new Date(p.createdAt).toISOString().split("T")[0],
                courseName: (_c = (_b = (_a = p.courses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : "N/A",
                amount: p.amount,
                status: p.status,
                invoiceId: p.razorpayOrderId,
            });
        }),
        notes: (_a = student.notes) !== null && _a !== void 0 ? _a : "",
    };
};
exports.adminStudentDetailsDto = adminStudentDetailsDto;
