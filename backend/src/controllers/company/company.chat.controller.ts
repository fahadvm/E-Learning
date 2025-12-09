import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { ICompanyChatService } from "../../core/interfaces/services/company/ICompanyChatService";
import { sendResponse } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { IChatService } from "../../core/interfaces/services/student/IStudentChatService";

@injectable()
export class CompanyChatController {
    constructor(
        @inject(TYPES.CompanyChatService) private _companyChatService: ICompanyChatService,
        @inject(TYPES.ChatService) private _chatService: IChatService
    ) { }

    getCompanyGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const companyId = req.params.companyId;
            // In a real app, I should verify if the requester (Company Admin or Employee) belongs to this company.
            // Assuming middleware handles auth/role check.
            const group = await this._companyChatService.getCompanyGroup(companyId);
            return sendResponse(res, STATUS_CODES.OK, "Company group fetched", true, group);
        } catch (error) {
            next(error);
        }
    };

    getGroupMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const chatId = req.params.chatId;
            const messages = await this._chatService.getMessages(chatId, 50, new Date().toISOString());
            return sendResponse(res, STATUS_CODES.OK, "Messages fetched successfully", true, messages);
        } catch (error) {
            next(error);
        }
    }
}
