// controllers/teacher/TeacherAvailabilityController.ts
import { inject, injectable } from 'inversify';
import { Response } from 'express';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { ITeacherAvailabilityService } from '../../core/interfaces/services/teacher/ITeacherAvailability';

@injectable()
export class TeacherAvailabilityController {
  constructor(
    @inject(TYPES.TeacherAvailabilityService)
    private readonly _availabilityService: ITeacherAvailabilityService
  ) {}

  async saveAvailability(req: AuthRequest, res: Response): Promise<void> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const { week } = req.body;
    const saved = await this._availabilityService.saveAvailability(teacherId, week);
    sendResponse(res, STATUS_CODES.CREATED, 'Availability saved successfully', true, saved);
  }

  async getMyAvailability(req: AuthRequest, res: Response): Promise<void> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const availabilities = await this._availabilityService.getAvailabilityByTeacherId(teacherId);
    sendResponse(res, STATUS_CODES.OK, 'Availability fetched', true, availabilities);
  }
}
