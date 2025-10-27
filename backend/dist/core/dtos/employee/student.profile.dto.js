"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeProfileDto = void 0;
const employeeProfileDto = (employee) => ({
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
    position: employee.position
});
exports.employeeProfileDto = employeeProfileDto;
