"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Admin Route Modules
const admin_auth_route_1 = __importDefault(require("./adminRoute/admin.auth.route"));
const admin_course_route_1 = __importDefault(require("./adminRoute/admin.course.route"));
const admin_student_route_1 = __importDefault(require("./adminRoute/admin.student.route"));
const admin_teacher_route_1 = __importDefault(require("./adminRoute/admin.teacher.route"));
const admin_company_route_1 = __importDefault(require("./adminRoute/admin.company.route"));
const admin_subscription_route_1 = __importDefault(require("./adminRoute/admin.subscription.route"));
const admin_order_route_1 = __importDefault(require("./adminRoute/admin.order.route"));
const admin_profile_route_1 = __importDefault(require("./adminRoute/admin.profile.route"));
// import employeeRoutes from './adminRoute/admin.employee.route';
const adminRouter = (0, express_1.Router)();
adminRouter.use('/auth', admin_auth_route_1.default);
adminRouter.use('/courses', admin_course_route_1.default);
adminRouter.use('/students', admin_student_route_1.default);
adminRouter.use('/teachers', admin_teacher_route_1.default);
adminRouter.use('/companies', admin_company_route_1.default);
adminRouter.use('/subscriptions', admin_subscription_route_1.default);
adminRouter.use('/orders', admin_order_route_1.default);
adminRouter.use('/profile', admin_profile_route_1.default);
// adminRouter.use('/employees', employeeRoutes);
exports.default = adminRouter;
