// controllers/aiTutorController.ts
import { Response } from 'express';
import { IStudentAiTutorService } from '../../core/interfaces/services/shared/IAiService';
import { inject, injectable } from 'inversify';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';

@injectable()
export class AiTutorController {
    constructor(
        @inject(TYPES.StudentAiTutorService) private _aiService: IStudentAiTutorService
    ) { }

    askQuestion = async (req: AuthRequest, res: Response) => {

        const studentId = req.user?.id;
        const { courseId } = req.params;
        if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        const { prompt } = req.body;



        const reply = await this._aiService.getCourseAnswer(studentId, courseId, prompt);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTIFICATIONS_FETCHED, true, reply);


    };
}
