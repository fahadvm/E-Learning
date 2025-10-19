import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IChatService } from "../../core/interfaces/services/student/IStudentChatService";
import { TYPES } from "../../core/di/types";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import { Chat } from "../../models/chat";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { Message } from "../../models/message";

@injectable()
export class ChatController {
    constructor(@inject(TYPES.ChatService) private _chatService: IChatService) { }

    getMessages = async (req: Request, res: Response) => {
        const { chatId } = req.params;
        const limit = parseInt(req.query.limit as string) || 20;
        const before = req.query.before as string ;


        const messages = await this._chatService.getMessages(chatId ,limit, before);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, messages);
    };
    getChatDetails = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const details = await this._chatService.getChatDetails(chatId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, details);
    };

    getUserChats = async (req: AuthRequest, res: Response) => {
        console.log("student chat history fetching........")
        const userId = req.user?.id;
        if (!userId) {
            throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED)
        }
        const chats = await this._chatService.getUserChats(userId);
        if (chats.length > 1) console.log(chats, "student chat history fetched........", chats)
        sendResponse(res, STATUS_CODES.OK, MESSAGES.CHAT_LIST_FETCHED, true, chats);

    };


    startChat = async (req: Request, res: Response) => {
        const { studentId, teacherId } = req.body


        let chat = await Chat.findOne({
            participants: { $all: [studentId, teacherId] },
        })

        if (!chat) {
            chat = await Chat.create({
                participants: [studentId, teacherId],
                studentId,
                teacherId
            })
        }

        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, chat);

    };



}
