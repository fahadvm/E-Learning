import { Router } from 'express';
import container from '../../core/di/container';
import { TYPES } from '../../core/di/types';
import { CompanyChatController } from '../../controllers/company/company.chat.controller';
import { CompanyAuthMiddleware } from '../../middleware/CompanyAuth';

const companyChatRouter = Router();

const companyChatController = container.get<CompanyChatController>(TYPES.CompanyChatController);

companyChatRouter.get('/:companyId', CompanyAuthMiddleware, companyChatController.getCompanyGroup);
companyChatRouter.get('/messages/:chatId', CompanyAuthMiddleware, companyChatController.getGroupMessages);

export default companyChatRouter;
