"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProfileDto = void 0;
const adminProfileDto = (admin) => ({
    _id: admin._id.toString(),
    email: admin.email,
    role: admin.role,
});
exports.adminProfileDto = adminProfileDto;
