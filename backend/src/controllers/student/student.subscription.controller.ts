// src/controllers/student/student.subscription.controller.ts
import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentSubscriptionService } from '../../core/interfaces/services/student/IStudentSubscriptionService';
import { IStudentSubscriptionController } from '../../core/interfaces/controllers/student/IStudentSubscriptionController';
import { TYPES } from '../../core/di/types';
import { AuthRequest } from '../../types/AuthenticatedRequest';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';

@injectable()
export class StudentSubscriptionController implements IStudentSubscriptionController {
  constructor(
    @inject(TYPES.StudentSubscriptionService)
    private readonly _planService: IStudentSubscriptionService
  ) {}

  getAllStudentPlans = async (_req: Request, res: Response) => {
    const plans = await this._planService.getAllForStudent();
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.SUBSCRIPTION_PLANS_FETCHED, true, plans);
  };



  createOrder = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);
    const { planId } = req.body;
    if (!planId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const order = await this._planService.createOrder(studentId, planId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.ORDER_CREATED, true, order);
  };

  verifyPayment = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const result = await this._planService.verifyPayment(studentId, req.body);
    
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.PAYMENT_VERIFIED_SUCCESSFULLY, true, result);
  };

  activateFreePlan = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { planId } = req.body;
    if (!planId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const subscription = await this._planService.activateFreePlan(studentId, planId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.FREE_PLAN_ACTIVATED, true, subscription);
  };

  getActiveSubscription = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const activeSub = await this._planService.getActiveSubscription(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.ACTIVE_SUBSCRIPTION_FETCHED, true, activeSub);
  };
}
