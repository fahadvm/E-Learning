"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const EmployeeAuth_1 = require("../../middleware/EmployeeAuth");
const employeeChatRouter = (0, express_1.Router)();
const companyChatController = container_1.default.get(types_1.TYPES.CompanyChatController);
// Employee requests company group chat. 
// They can pass companyId, or we can extract it from their token/profile if stored.
// For now, assuming they pass companyId or we fetch it.
// The service simply gets by companyId.
employeeChatRouter.get('/:companyId', EmployeeAuth_1.EmployeeAuthMiddleware, companyChatController.getCompanyGroup);
employeeChatRouter.get('/messages/:chatId', EmployeeAuth_1.EmployeeAuthMiddleware, companyChatController.getGroupMessages);
exports.default = employeeChatRouter;
