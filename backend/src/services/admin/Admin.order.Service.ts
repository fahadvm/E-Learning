// src/services/admin/adminOrder.service.ts
import { inject, injectable } from "inversify";
import { IAdminOrderService } from "../../core/interfaces/services/admin/IAdminOrderService"
import { ICompanyOrderRepository } from "../../core/interfaces/repositories/ICompanyOrderRepository";
import { IOrderRepository } from "../../core/interfaces/repositories/IOrderRepository";
import { TYPES } from "../../core/di/types";
import { ICompanyOrder } from "../../models/CompanyOrder";
import { IOrder } from "../../models/Order";

@injectable()
export class AdminOrderService implements IAdminOrderService {
  constructor(
    @inject(TYPES.OrderRepository) private _studenyOrderRepo: IOrderRepository,
    @inject(TYPES.CompanyOrderRepository) private _companyOrderRepo: ICompanyOrderRepository,
  ) {}

  async getCompanyOrders(): Promise<ICompanyOrder[]> {
    return this._companyOrderRepo.getCompanyOrders();
  }

  async getStudentOrders(): Promise<IOrder[]> {
    return this._studenyOrderRepo.getStudentOrders();
  }
}
