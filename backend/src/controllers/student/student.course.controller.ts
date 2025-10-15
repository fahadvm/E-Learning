// src/controllers/student/student.course.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentCourseService } from '../../core/interfaces/services/student/IStudentCourseService';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

import { IStudentCourseController } from '../../core/interfaces/controllers/student/IStudentCourseController';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import axios from 'axios';

@injectable()
export class StudentCourseController implements IStudentCourseController {
  constructor(@inject(TYPES.StudentCourseService) private readonly _courseService: IStudentCourseService) { }


  getAllCourses = async (req: Request, res: Response) => {

    const {
      search,
      category,
      level,
      language,
      sort = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '8'
    } = req.query;

    const courses = await this._courseService.getAllCourses({
      search: search as string,
      category: category as string,
      level: level as string,
      language: language as string,
      sort: sort as string,
      order: order as string,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    });
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSES_FETCHED, true, courses);
  };

  getCourseDetailById = async (req: Request, res: Response) => {
    const { courseId } = req.params;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const course = await this._courseService.getCourseDetail(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_DETAILS_FETCHED, true, course);
  };
  markLessonComplete = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    const { courseId, lessonIndex } = req.params;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    if (!lessonIndex) throwError("Lesson ID is required", STATUS_CODES.BAD_REQUEST);
    console.log(studentId, courseId, lessonIndex)
    const result = await this._courseService.markLessonComplete(studentId, courseId, lessonIndex);
    console.log("here controller will show the final result ", result)
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COMPLETD_LESSON_MARKED, true, result);
  };

  codecompiler = async (req: AuthRequest, res: Response) => {
    console.log("compiler ready to start code runner")
    const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
    const { language, code } = req.body;

    if (!language || !code) throwError("Language and code are required", STATUS_CODES.BAD_REQUEST);

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
    if (!languageId) throwError("Unsupported language", STATUS_CODES.CONFLICT);

    try {
      const response = await axios.post(
        JUDGE0_URL,
        {
          source_code: code,
          language_id: languageId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY || "0d5115fdbcmsh30c67d2f61ef3e7p142104jsn296e045ea6a4",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const output = response.data.stdout || response.data.stderr || "No output";

      console.log("response  of code runner :", response.data.stdout)

      return sendResponse(res, STATUS_CODES.OK, MESSAGES.CODE_RUN_SUCCESSFULLY, true, output);
    } catch (error: any) {
      console.log(error)
      return sendResponse(res, STATUS_CODES.INTERNAL_SERVER_ERROR, "Error running code", false, error?.message || error);
    }
  };

  noteSaving = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id
    const { courseId, notes } = req.body
    if (!studentId || !courseId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.BAD_REQUEST)
    const saving = await this._courseService.saveNotes(studentId, courseId, notes)
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.NOTE_SAVED_SUCCESSFULLY, true, saving);
  }
  getCourseResources = async (req: AuthRequest, res: Response) => {
    const {courseId}  = req.params
    if (!courseId) throwError(MESSAGES.ID_REQUIRED, STATUS_CODES.BAD_REQUEST)
    const resources = await this._courseService.getResources(courseId)
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.RESOURCES_FETCHED, true, resources);
  }






}
