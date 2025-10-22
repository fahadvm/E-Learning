// src/controllers/admin/AdminOrderController.ts
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { sendResponse, throwError } from '../../utils/ResANDError';
import { TYPES } from '../../core/di/types';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IAdminOrderController } from '../../core/interfaces/controllers/admin/IAdminOrderController';
import { IAdminOrderService } from '../../core/interfaces/services/admin/IAdminOrderService';

@injectable()
export class AdminOrderController implements IAdminOrderController {
  constructor(
    @inject(TYPES.AdminOrderService)
    private readonly _orderService: IAdminOrderService
  ) {}

  // ✅ Get all company purchases
  async getCompanyOrders(req: Request, res: Response): Promise<void> {
    const orders = await this._orderService.getCompanyOrders();

    if (!orders || orders.length === 0) {
      throwError(MESSAGES.ORDERS_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.COMPANY_ORDERS_FETCHED,
      true,
      orders
    );
  }

  // ✅ Get all student purchases
  async getStudentOrders(req: Request, res: Response): Promise<void> {
    const orders = await this._orderService.getStudentOrders();

    if (!orders || orders.length === 0) {
      throwError(MESSAGES.ORDERS_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    sendResponse(
      res,
      STATUS_CODES.OK,
      MESSAGES.STUDENT_ORDERS_FETCHED,
      true,
      orders
    );
  }
}
