import { Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../core/di/types";
import { AuthRequest } from "../../types/AuthenticatedRequest";
import { sendResponse, throwError } from "../../utils/ResANDError";
import { MESSAGES } from "../../utils/ResponseMessages";
import { STATUS_CODES } from "../../utils/HttpStatuscodes";
import { IStudentCourseCertificateService } from "../../core/interfaces/services/student/IStudentCourseCertificateService";

@injectable()
export class StudentCourseCertificateController {
  constructor(
    @inject(TYPES.StudentCourseCertificateService)
    private readonly _certService: IStudentCourseCertificateService
  ) {}

  generateCourseCertificate = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courseId }: { courseId: string } = req.body;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const certificate = await this._certService.generateCourseCertificate(studentId, courseId);

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.COURSE_CERTIFICATE_GENERATED,
      true,
      certificate
    );
  };

  getMyCourseCertificates = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const page: number = Number(req.query.page) || 1;
    const limit: number = Number(req.query.limit) || 6;
    const search: string = typeof req.query.search === "string" ? req.query.search : "";

    const result = await this._certService.getMyCourseCertificates(studentId, page, limit, search);

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.COURSE_CERTIFICATE_LIST_FETCHED,
      true,
      {
        certificates: result.certificates,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    );
  };

  getCourseCertificate = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courseId } = req.params as { courseId: string };
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const certificate = await this._certService.getCourseCertificate(studentId, courseId);

    return sendResponse(res, STATUS_CODES.OK, MESSAGES.COURSE_CERTIFICATE_FETCHED, true, certificate);
  };
}
