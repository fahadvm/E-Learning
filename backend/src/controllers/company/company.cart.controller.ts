// src/controllers/company/company.cart.controller.ts
import {  Response } from 'express';
import { inject, injectable } from 'inversify';
import { ICompanyCartService } from '../../core/interfaces/services/company/ICompanyCartService';
import { ICompanyCartController } from '../../core/interfaces/controllers/company/ICompanyCartController';
import { TYPES } from '../../core/di/types';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { MESSAGES } from '../../utils/ResponseMessages';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { AuthRequest } from '../../types/AuthenticatedRequest';
@injectable()
export class CompanyCartController implements ICompanyCartController {
  constructor(
    @inject(TYPES.CompanyCartService)
    private readonly _cartService: ICompanyCartService
  ) {}

  getCart = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const cart = await this._cartService.getCart(companyId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_FETCHED, true, cart);
  };

  addToCart = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courseId } = req.body;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const cart = await this._cartService.addToCart(companyId, courseId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_UPDATED, true, cart);
  };

  removeFromCart = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const { courseId } = req.params;
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const cart = await this._cartService.removeFromCart(companyId, courseId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_UPDATED, true, cart);
  };

  clearCart = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.id;
    if (!companyId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    const cart = await this._cartService.clearCart(companyId);
    return sendResponse(res, STATUS_CODES.OK, MESSAGES.CART_CLEARED, true, cart);
  };
}
