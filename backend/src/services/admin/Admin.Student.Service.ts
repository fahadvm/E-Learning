import { inject, injectable } from 'inversify';
import { IAdminStudentService } from '../../core/interfaces/services/admin/IAdminStudentService';
import { IStudentRepository } from '../../core/interfaces/repositories/IStudentRepository';
import { IStudent } from '../../models/Student';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IAdminStudentDTO, PaginatedStudentDTO, adminStudentDto } from '../../core/dtos/admin/Admin.student.Dto';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { ISubscriptionPlanRepository } from '../../core/interfaces/repositories/ISubscriptionPlanRepository';

@injectable()
export class AdminStudentService implements IAdminStudentService {
  constructor(
    @inject(TYPES.StudentRepository) private readonly _studentRepo: IStudentRepository,
    @inject(TYPES.OrderRepository) private readonly _enrollmentRepo: IOrderRepository,
    @inject(TYPES.SubscriptionPlanRepository) private readonly _subscriptionRepo: ISubscriptionPlanRepository,
  ) { }

  async createStudent(data: Partial<IStudent>): Promise<IAdminStudentDTO> {
    const student = await this._studentRepo.create(data);
    return adminStudentDto(student);
  }

  async getAllStudents(
    page: number,
    limit: number,
    search?: string
  ): Promise<any> {
    if (page < 1 || limit < 1) {
      throwError(MESSAGES.PAGE_OUT_OF_RANGE, STATUS_CODES.BAD_REQUEST);
    }

    const skip = (page - 1) * limit;

    // Fetch students using your existing repository
    const students = await this._studentRepo.findAll(skip, limit, search);
    const total = await this._studentRepo.count(search);
    const totalPages = Math.ceil(total / limit);

    const finalStudents = [];

    for (const student of students) {

      const orders = await this._enrollmentRepo.getOrdersByStudentId(student._id.toString());
      const enrolledCourses = orders.flatMap(order => order.courses || []);

      const currentPlan = await this._subscriptionRepo.findActiveSubscription(student._id.toString());
      console.log("current plan ", currentPlan)

      finalStudents.push({
        ...adminStudentDto(student),
        courseCount: enrolledCourses.length,
        currentPlan: currentPlan
          ? {
            name: currentPlan.planId.name,
            price: currentPlan.planId.price,
            expiresAt: currentPlan.planId.expiresAt,
          }
          : null,
      });
    }

    return {
      students: finalStudents,
      total,
      totalPages,
    };
  }

  async getStudentById(studentId: string): Promise<any> {
    const student = await this._studentRepo.findById(studentId);
    const orders = await this._enrollmentRepo.getOrdersByStudentId(studentId);
    const enrolledCourses = orders.flatMap(order => order.courses || []);
    const currentPlan = await this._subscriptionRepo.findActiveSubscription(studentId);
    if (!student) throwError(MESSAGES.STUDENT_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return {
      student,
      currentPlan: currentPlan
        ? {
          name: currentPlan.planId.name,
          price: currentPlan.planId.price,
          expiresAt: currentPlan.planId.expiresAt,
        }
        : null,
      courses: enrolledCourses,
    };
  }

  async updateStudent(studentId: string, data: Partial<IStudent>): Promise<IAdminStudentDTO> {
    const updated = await this._studentRepo.update(studentId, data);
    return adminStudentDto(updated);
  }

  async blockStudent(studentId: string): Promise<IAdminStudentDTO> {
    const blocked = await this._studentRepo.update(studentId, { isBlocked: true });
    return adminStudentDto(blocked);
  }

  async unblockStudent(studentId: string): Promise<IAdminStudentDTO> {
    const unblocked = await this._studentRepo.update(studentId, { isBlocked: false });
    return adminStudentDto(unblocked);
  }
}
