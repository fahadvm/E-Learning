"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminEmployeeDto = void 0;
const adminEmployeeDto = (employee) => {
    var _a, _b, _c, _d;
    return ({
        _id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        companyId: ((_b = (_a = employee.companyId) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || ((_c = employee.companyId) === null || _c === void 0 ? void 0 : _c.toString()),
        companyName: (_d = employee.companyId) === null || _d === void 0 ? void 0 : _d.name,
        coursesAssigned: (employee.coursesAssigned || []).map((c) => {
            var _a;
            return ({
                _id: ((_a = c._id) === null || _a === void 0 ? void 0 : _a.toString()) || c.toString(),
                title: c.title || "Unknown Course"
            });
        }),
        position: employee.position,
        department: employee.department,
        isBlocked: employee.isBlocked,
        subscription: employee.subscription,
        profilePicture: employee.profilePicture,
        createdAt: employee.createdAt,
    });
};
exports.adminEmployeeDto = adminEmployeeDto;
