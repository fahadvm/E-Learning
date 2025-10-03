"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyProfileDto = void 0;
const companyProfileDto = (company) => {
    var _a;
    return ({
        _id: company._id.toString(),
        name: company.name,
        email: company.email,
        status: company.status,
        rejectReason: company.rejectReason,
        employees: ((_a = company.employees) === null || _a === void 0 ? void 0 : _a.map(empId => empId.toString())) || [],
        isPremium: company.isPremium,
        isVerified: company.isVerified,
    });
};
exports.companyProfileDto = companyProfileDto;
