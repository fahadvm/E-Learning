import { Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IEmployeeCourseService } from '../../core/interfaces/services/employee/IEmployeeCourseService';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

@injectable()
export class EmployeeCourseController {
    constructor(
        @inject(TYPES.EmployeeCourseService) private _employeeCourseService: IEmployeeCourseService
    ) { }

    async myCourses(req: AuthRequest, res: Response) {
        const employeeId = req.user?.id;
        if (!employeeId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
        const courses = await this._employeeCourseService.getMyCourses(employeeId);
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
    }

    async myCourseDetails(req: AuthRequest, res: Response) {
        const employeeId = req.user?.id;
        if (!employeeId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
        const { courseId } = req.params;
        const course = await this._employeeCourseService.getMyCourseDetails(employeeId, courseId);
        console.log("fetching course details", course)
        sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, course);
    }
    markLessonComplete = async (req: AuthRequest, res: Response) => {
        const studentId = req.user?.id;
        const { courseId, lessonIndex } = req.params;
        if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
        if (!lessonIndex) throwError('Lesson ID is required', STATUS_CODES.BAD_REQUEST);
        const result = await this._employeeCourseService.markLessonComplete(studentId, courseId, lessonIndex);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPLETD_LESSON_MARKED, true, result);
    };

    codecompiler = async (req: AuthRequest, res: Response) => {
        const JUDGE0_URL = process.env.JUDGE0_URL!;
        const { language, code } = req.body;

        if (!language || !code) throwError('Language and code are required', STATUS_CODES.BAD_REQUEST);

        const languageMap: Record<string, number> = {
            python: 71,        // Python 3
            javascript: 63,    // Node.js
            cpp: 54,           // C++
            java: 62,          // Java
            c: 50,             // C
            csharp: 51,        // C#
            php: 68,           // PHP
            go: 60,            // Go
            ruby: 72,          // Ruby
            sql: 82,           // SQL (SQLite)
        };

        const languageId = languageMap[language.toLowerCase()];
        if (!languageId) throwError('Unsupported language', STATUS_CODES.CONFLICT);

        const response = await axios.post(
            JUDGE0_URL,
            {
                source_code: code,
                language_id: languageId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': process.env.JUDGE0_API_KEY || '0d5115fdbcmsh30c67d2f61ef3e7p142104jsn296e045ea6a4',
                    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                },
            }
        );

        const output = response.data.stdout || response.data.stderr || 'No output';
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.CODE_RUN_SUCCESSFULLY, true, output);

    };

    noteSaving = async (req: AuthRequest, res: Response) => {
        const studentId = req.user?.id;
        const { courseId, notes } = req.body;
        if (!studentId || !courseId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST);
        const saving = await this._employeeCourseService.saveNotes(studentId, courseId, notes);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTE_SAVED_SUCCESSFULLY, true, saving);
    };
    getCourseResources = async (req: AuthRequest, res: Response) => {
        const { courseId } = req.params;
        if (!courseId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST);
        const resources = await this._employeeCourseService.getResources(courseId);
        return sendResponse(res, STATUS_CODES.OK, MESSAGES.RESOURCES_FETCHED, true, resources);
    };

}
