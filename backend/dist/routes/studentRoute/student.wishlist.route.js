"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const router = (0, express_1.Router)();
const studentWishlistCtrl = container_1.default.get(types_1.TYPES.StudentWishlistController);
router.post('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentWishlistCtrl.add.bind(studentWishlistCtrl)));
router.get('/', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentWishlistCtrl.list.bind(studentWishlistCtrl)));
router.delete('/:courseId', (0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentWishlistCtrl.remove.bind(studentWishlistCtrl)));
exports.default = router;
