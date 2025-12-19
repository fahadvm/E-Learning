"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const JWTtoken_1 = require("../utils/JWTtoken");
const ResANDError_1 = require("../utils/ResANDError");
const HttpStatuscodes_1 = require("../utils/HttpStatuscodes");
const Student_1 = require("../models/Student");
const Teacher_1 = require("../models/Teacher");
const Company_1 = require("../models/Company");
const Employee_1 = require("../models/Employee");
const ResponseMessages_1 = require("../utils/ResponseMessages");
const authMiddleware = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        if (!token) {
            return (0, ResANDError_1.throwError)('No token provided', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
        }
        try {
            const decoded = (0, JWTtoken_1.verifyAccessToken)(token);
            if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) !== role) {
                return (0, ResANDError_1.throwError)('Unauthorized role access', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            const userId = decoded === null || decoded === void 0 ? void 0 : decoded.id;
            if (!userId)
                return (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            let isBlocked = false;
            // Global blocking check
            if (role === 'student') {
                const student = yield Student_1.Student.findById(userId).select('isBlocked');
                isBlocked = !!(student === null || student === void 0 ? void 0 : student.isBlocked);
            }
            else if (role === 'teacher') {
                const teacher = yield Teacher_1.Teacher.findById(userId).select('isBlocked');
                isBlocked = !!(teacher === null || teacher === void 0 ? void 0 : teacher.isBlocked);
            }
            else if (role === 'company') {
                const company = yield Company_1.Company.findById(userId).select('isBlocked');
                isBlocked = !!(company === null || company === void 0 ? void 0 : company.isBlocked);
            }
            else if (role === 'employee') {
                const employee = yield Employee_1.Employee.findById(userId).select('isBlocked');
                isBlocked = !!(employee === null || employee === void 0 ? void 0 : employee.isBlocked);
            }
            if (isBlocked) {
                // Clear cookie if user is blocked
                res.clearCookie('token');
                return (0, ResANDError_1.throwError)('Your account has been blocked by admin', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            req.user = {
                id: userId,
                role: decoded === null || decoded === void 0 ? void 0 : decoded.role,
            };
            next();
        }
        catch (err) {
            if (err.statusCode) {
                return next(err);
            }
            return (0, ResANDError_1.throwError)('Invalid or expired token', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
        }
    });
};
exports.authMiddleware = authMiddleware;
