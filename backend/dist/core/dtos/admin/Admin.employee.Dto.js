"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminEmployeeDto = void 0;
const adminEmployeeDto = (employee) => {
    var _a, _b;
    return ({
        _id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        companyId: (_a = employee.companyId) === null || _a === void 0 ? void 0 : _a.toString(),
        coursesAssigned: ((_b = employee.coursesAssigned) === null || _b === void 0 ? void 0 : _b.map(id => id.toString())) || [],
        position: employee.position,
        isBlocked: employee.isBlocked,
        subscription: employee.subscription,
    });
};
exports.adminEmployeeDto = adminEmployeeDto;
