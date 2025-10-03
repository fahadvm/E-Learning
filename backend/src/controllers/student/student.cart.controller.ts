// src/controllers/student/student.cart.controller.ts
import {  Response } from 'express';
import { inject, injectable } from 'inversify';
import { IStudentCartService } from '../../core/interfaces/services/student/IStudentCartService';
import { IStudentCartController } from '../../core/interfaces/controllers/student/IStudentCartController';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';
@injectable()
export class StudentCartController implements IStudentCartController {
  constructor(
    @inject(TYPES.StudentCartService)
    private readonly _cartService: IStudentCartService
  ) {}

  getCart = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const cart = await this._cartService.getCart(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_FETCHED, true, cart);
  };

  addToCart = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courseId } = req.body;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const cart = await this._cartService.addToCart(studentId, courseId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_UPDATED, true, cart);
  };

  removeFromCart = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courseId } = req.params;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const cart = await this._cartService.removeFromCart(studentId, courseId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_UPDATED, true, cart);
  };

  clearCart = async (req: AuthRequest, res: Response) => {
    const studentId = req.user?.id;
    if (!studentId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const cart = await this._cartService.clearCart(studentId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_CLEARED, true, cart);
  };
}
