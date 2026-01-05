"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCompanyEmployeeDto = exports.adminCompanyDto = void 0;
const adminCompanyDto = (company) => {
    var _a;
    return ({
        _id: company._id.toString(),
        name: company.name,
        email: company.email,
        about: company.about || null,
        phone: company.phone || null,
        website: company.website || null,
        profilePicture: company.profilePicture || null,
        status: company.status,
        rejectReason: company.rejectReason,
        isPremium: company.isPremium,
        isVerified: company.isVerified,
        employees: ((_a = company.employees) === null || _a === void 0 ? void 0 : _a.map((emp) => ({
            _id: emp._id.toString(),
            name: emp.name,
            email: emp.email,
            position: emp.position,
            isBlocked: !!emp.isBlocked,
            coursesAssigned: 0, // Default value as detailed stats might not be populated here
            coursesCompleted: 0
        }))) || [],
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
    });
};
exports.adminCompanyDto = adminCompanyDto;
const adminCompanyEmployeeDto = (employee) => ({
    _id: employee._id.toString(),
    name: employee.name,
    email: employee.email,
    position: employee.position,
    isBlocked: !!employee.isBlocked,
    coursesAssigned: 0,
    coursesCompleted: 0
});
exports.adminCompanyEmployeeDto = adminCompanyEmployeeDto;
