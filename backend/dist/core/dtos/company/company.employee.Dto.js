"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyEmployeeDto = void 0;
const companyEmployeeDto = (employee) => {
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
exports.companyEmployeeDto = companyEmployeeDto;
