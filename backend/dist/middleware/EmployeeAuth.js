"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeAuthMiddleware = void 0;
const authMiddleware_1 = require("./authMiddleware");
exports.EmployeeAuthMiddleware = (0, authMiddleware_1.authMiddleware)('employee');
