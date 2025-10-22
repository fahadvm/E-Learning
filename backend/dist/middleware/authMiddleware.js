"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const JWTtoken_1 = require("../utils/JWTtoken");
const ResANDError_1 = require("../utils/ResANDError");
const HttpStatuscodes_1 = require("../utils/HttpStatuscodes");
const authMiddleware = (role) => {
    return (req, res, next) => {
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
            req.user = {
                id: decoded === null || decoded === void 0 ? void 0 : decoded.id,
                role: decoded === null || decoded === void 0 ? void 0 : decoded.role,
            };
            // console.log('req.user from middleware:' ,req.user);
            next();
        }
        catch (_b) {
            return (0, ResANDError_1.throwError)('Invalid or expired token', HttpStatuscodes_1.STATUS_CODES.UNAUTHORIZED);
        }
    };
};
exports.authMiddleware = authMiddleware;
