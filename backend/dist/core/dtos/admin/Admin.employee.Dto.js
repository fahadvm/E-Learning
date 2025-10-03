"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminEmployeeDto = void 0;
const adminEmployeeDto = (employee) => {
    var _a;
    return ({
        _id: employee._id.toString(),
        name: employee.name,
        email: employee.email,
        companyId: employee.companyId.toString(),
        coursesAssigned: ((_a = employee.coursesAssigned) === null || _a === void 0 ? void 0 : _a.map(id => id.toString())) || [],
        position: employee.position,
        isBlocked: employee.isBlocked,
        subscription: employee.subscription,
    });
};
exports.adminEmployeeDto = adminEmployeeDto;
