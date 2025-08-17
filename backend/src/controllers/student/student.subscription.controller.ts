// src/controllers/student/student.subscription.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentSubscriptionService } from '../../core/interfaces/services/student/IStudentSubscriptionService';
import { TYPES } from '../../core/di/types';
import { sendResponse } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class StudentSubscriptionController {
  constructor(
    @inject(TYPES.StudentSubscriptionService)
    private readonly _planService: IStudentSubscriptionService
  ) {}

  async getAllStudentPlans(_req: Request, res: Response) {
    const plans = await this._planService.getAllForStudent();
    return sendResponse(res,STATUS_CODES.OK,MESSAGES.SUBSCRIPTION_PLANS_FETCHED,true,plans);
  }


}
