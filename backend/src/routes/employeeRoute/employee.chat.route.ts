import { Router } from "express";
import container from "../../core/di/container";
import { TYPES } from "../../core/di/types";
import { CompanyChatController } from "../../controllers/company/company.chat.controller";
import { EmployeeAuthMiddleware } from "../../middleware/EmployeeAuth";

const employeeChatRouter = Router();

const companyChatController = container.get<CompanyChatController>(TYPES.CompanyChatController);

// Employee requests company group chat. 
// They can pass companyId, or we can extract it from their token/profile if stored.
// For now, assuming they pass companyId or we fetch it.
// The service simply gets by companyId.

employeeChatRouter.get('/:companyId', EmployeeAuthMiddleware, companyChatController.getCompanyGroup);
employeeChatRouter.get('/messages/:chatId', EmployeeAuthMiddleware, companyChatController.getGroupMessages);

export default employeeChatRouter;
