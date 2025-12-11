"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const container_1 = __importDefault(require("../../core/di/container"));
const types_1 = require("../../core/di/types");
const CompanyAuth_1 = require("../../middleware/CompanyAuth");
const companyChatRouter = (0, express_1.Router)();
const companyChatController = container_1.default.get(types_1.TYPES.CompanyChatController);
companyChatRouter.get('/:companyId', CompanyAuth_1.CompanyAuthMiddleware, companyChatController.getCompanyGroup);
companyChatRouter.get('/messages/:chatId', CompanyAuth_1.CompanyAuthMiddleware, companyChatController.getGroupMessages);
exports.default = companyChatRouter;
