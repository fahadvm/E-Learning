"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const asyncHandler_1 = require("../../middleware/asyncHandler");
const types_1 = require("../../core/di/types");
const profileRouter = (0, express_1.Router)();
const studentProfileCtrl = container_1.default.get(types_1.TYPES.StudentProfileController);
profileRouter.route('/')
    .get((0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentProfileCtrl.getProfile.bind(studentProfileCtrl)))
    .patch((0, authMiddleware_1.authMiddleware)('student'), (0, asyncHandler_1.asyncHandler)(studentProfileCtrl.editProfile.bind(studentProfileCtrl)));
exports.default = profileRouter;
