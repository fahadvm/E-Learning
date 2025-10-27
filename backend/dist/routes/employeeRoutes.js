"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employee_auth_route_1 = __importDefault(require("./employeeRoute/employee.auth.route"));
const employee_profile_route_1 = __importDefault(require("./employeeRoute/employee.profile.route"));
const employee_company_route_1 = __importDefault(require("./employeeRoute/employee.company.route"));
const employee_courses_route_1 = __importDefault(require("./employeeRoute/employee.courses.route"));
const employeeRouter = (0, express_1.Router)();
employeeRouter.use('/auth', employee_auth_route_1.default);
employeeRouter.use('/profile', employee_profile_route_1.default);
employeeRouter.use('/company', employee_company_route_1.default);
employeeRouter.use('/courses', employee_courses_route_1.default);
exports.default = employeeRouter;
