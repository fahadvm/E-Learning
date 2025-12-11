"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyAuthMiddleware = void 0;
const authMiddleware_1 = require("./authMiddleware");
exports.CompanyAuthMiddleware = (0, authMiddleware_1.authMiddleware)('company');
