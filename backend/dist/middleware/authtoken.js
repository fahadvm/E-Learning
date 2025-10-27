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
exports.authenticateToken = void 0;
const JWTtoken_1 = require("../utils/JWTtoken");
const ResANDError_1 = require("../utils/ResANDError");
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token;
    if (!accessToken) {
        (0, ResANDError_1.sendResponse)(res, 401, '', true);
        return;
    }
    const decoded = (0, JWTtoken_1.verifyAccessToken)(accessToken);
    if ((decoded === null || decoded === void 0 ? void 0 : decoded.id) && decoded.role === 'user') {
        next();
        return;
    }
    (0, JWTtoken_1.clearTokens)(res);
});
exports.authenticateToken = authenticateToken;
