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
const ResponseMessages_1 = require("../utils/ResponseMessages");
const authMiddleware = (role) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
        // console.log(' authMiddleware token is :', token);
        if (!token) {
            return (0, ResANDError_1.throwError)('No token provided', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
        }
        try {
            const decoded = (0, JWTtoken_1.verifyAccessToken)(token);
            // console.log(' authMiddleware decoded is :', decoded);
            if ((decoded === null || decoded === void 0 ? void 0 : decoded.role) !== role) {
                return (0, ResANDError_1.throwError)('Unauthorized role access', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
            }
            if (role === 'student') {
                if (!(decoded === null || decoded === void 0 ? void 0 : decoded.id))
                    return (0, ResANDError_1.throwError)(ResponseMessages_1.MESSAGES.ID_REQUIRED, HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
                const student = yield Student_1.Student.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id).select('isBlocked');
                if (student === null || student === void 0 ? void 0 : student.isBlocked) {
                    console.log("blocked is working now ");
                    return (0, ResANDError_1.throwError)('Your account has been blocked by admin', HttpStatuscodes_1.STATUS_CODES.FORBIDDEN);
                }
            }
            req.user = {
                id: decoded === null || decoded === void 0 ? void 0 : decoded.id,
                role: decoded === null || decoded === void 0 ? void 0 : decoded.role,
            };
            next();
        }
        catch (err) {
            {
                if (err.statusCode) {
                    return next(err);
                }
                return (0, ResANDError_1.throwError)('Invalid or expired token', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
            }
        }
    });
};
exports.authMiddleware = authMiddleware;
