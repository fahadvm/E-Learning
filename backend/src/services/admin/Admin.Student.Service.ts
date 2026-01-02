import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IAdminStudentService } from '../../core/interfaces/services/admin/IAdminStudentService';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IStudent } from '../../models/Student';

import {
  adminStudentListDto,
  adminStudentDetailsDto,
  IAdminStudentListDTO,
  IAdminStudentDetailsDTO
} from '../../core/dtos/admin/Admin.student.Dto';

@injectable()
export class AdminStudentService implements IAdminStudentService {
  constructor(
    @inject(TYPES.StudentRepository) private readonly _studentRepo: IStudentRepository,
    @inject(TYPES.OrderRepository) private readonly _orderRepo: IOrderRepository,
    @inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionRepo: ISubscriptionPlanRepository
  ) { }

  async getAllStudents(
    page: number,
    limit: number,
    search: string,
    status: string
  ): Promise<{ data: IAdminStudentListDTO[]; total: number }> {
    const skip = (page - 1) * limit;

    const students = await this._studentRepo.findAll(skip, limit, search, status);
    const total = await this._studentRepo.count(search, status);

    const formatted: IAdminStudentListDTO[] = [];

    for (const student of students) {
      const orders = await this._orderRepo.getOrdersByStudentId(student._id.toString());
      const courseCount = orders.flatMap((o) => o.courses).length;
      const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);

      const studentObj = (student.toObject ? student.toObject() : student) as IStudent;
      formatted.push(
        adminStudentListDto({
          ...studentObj,
          courseCount,
          totalSpent
        } as unknown as IStudent & { courseCount?: number; totalSpent?: number })
      );
    }

    return { data: formatted, total };
  }

  async getStudentById(studentId: string): Promise<IAdminStudentDetailsDTO> {
    const student = await this._studentRepo.findById(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const orders = await this._orderRepo.getOrdersByStudentId(studentId);
    const courses = orders.flatMap((o) => o.courses || []);
    const purchases = orders;

    return adminStudentDetailsDto({
      student,
      courses,
      purchases
    });
  }

  async blockStudent(studentId: string): Promise<IAdminStudentListDTO> {
    const updated = await this._studentRepo.update(studentId, { isBlocked: true });
    if (!updated) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminStudentListDto(updated);
  }

  async unblockStudent(studentId: string): Promise<IAdminStudentListDTO> {
    const updated = await this._studentRepo.update(studentId, { isBlocked: false });
    if (!updated) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return adminStudentListDto(updated);
  }
}
