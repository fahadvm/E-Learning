"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeProfileDto = void 0;
const employeeProfileDto = (employee) => {
    var _a, _b, _c, _d;
    return ({
        _id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        about: employee.about,
        phone: employee.phone,
        profilePicture: employee.profilePicture,
        role: employee.role,
        isVerified: employee.isVerified,
        isBlocked: employee.isBlocked,
        social_links: employee.social_links,
        position: employee.position,
        department: employee.department,
        location: employee.location,
        streakCount: employee.streakCount,
        lastLoginDate: employee.lastLoginDate,
        longestStreak: employee.longestStreak,
        companyId: (_a = employee.companyId) === null || _a === void 0 ? void 0 : _a.toString(),
        requestedCompanyId: (_b = employee.requestedCompanyId) === null || _b === void 0 ? void 0 : _b.toString(),
        coursesAssigned: (_d = (_c = employee.coursesAssigned) === null || _c === void 0 ? void 0 : _c.map((id) => id.toString())) !== null && _d !== void 0 ? _d : [],
        status: employee.status,
        subscription: employee.subscription,
    });
};
exports.employeeProfileDto = employeeProfileDto;
