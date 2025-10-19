import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { MESSAGES } from "../../utils/ResponseMessages";
import { Chat } from "../../models/chat";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { Message } from "../../models/message";
import { ITeacherChatService } from "../../core/interfaces/services/teacher/ITeacherChatService";

@injectable()
export class TeacherChatController {
    constructor(@inject(TYPES.TeacherChatService) private _chatService: ITeacherChatService) { }

    getMessages = async (req: Request, res: Response) => {
        const { chatId } = req.params;
        // console.log("input of getmessages")

        const messages = await this._chatService.getMessages(chatId);
        // console.log("output of getmessages", messages)
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, messages);
    };
    getChatDetails = async (req: Request, res: Response) => {
        const { chatId } = req.params;

        const details = await this._chatService.getChatDetails(chatId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, details);
    };

    getUserChats = async (req: AuthRequest, res: Response) => {
        const userId  = req.user?.id;
        // console.log("this controller is working",userId)
        if(!userId){
            throwError( MESSAGES.UNAUTHORIZED ,STATUS_CODES.UNAUTHORIZED)
        }
        const chats = await this._chatService.getUserChats(userId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, chats);

    };


    startChat = async (req: Request, res: Response) => {
        const { studentId, teacherId } = req.body
        // console.log("input of chats", studentId, teacherId )


        let chat = await Chat.findOne({
            participants: { $all: [studentId, teacherId] },
        })

        if (!chat) {
            chat = await Chat.create({
                participants: [studentId, teacherId],
                studentId ,
                teacherId
            })
        }

        // console.log("output of chats", chat)
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, chat);

    };



}
