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

    const { courseId } = req.body;
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

    const certificates = await this._certService.getMyCourseCertificates(studentId);

    return sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.COURSE_CERTIFICATE_LIST_FETCHED,
      true,
      certificates
    );
  };
}
