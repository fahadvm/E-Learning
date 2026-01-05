import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { ITeacherChatService } from '../../core/interfaces/services/teacher/ITeacherChatService';

@injectable()
export class TeacherChatController {
    constructor(@inject(TYPES.TeacherChatService) private _chatService: ITeacherChatService) { }

    getMessages = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const messages = await this._chatService.getMessages(chatId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, messages);
    };
    getChatDetails = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const details = await this._chatService.getChatDetails(chatId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, details);
    };

    getUserChats = async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        }
        const chats = await this._chatService.getUserChats(userId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, chats);

    };


    startChat = async (req: Request, res: Response) => {
        const { studentId, teacherId } = req.body;
        const chat = await this._chatService.startChat(studentId, teacherId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.CHAT_STARTED, true, chat);
    };



}
