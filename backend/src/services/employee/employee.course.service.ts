import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { IEmployeeCourseService } from '../../core/interfaces/services/employee/IEmployeeCourseService';
import { ICompanyOrderRepository } from '../../core/interfaces/repositories/ICompanyOrderRepository';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { ICompanyOrder } from '../../models/CompanyOrder';
import { ICourse } from '../../models/Course';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { IEmployee } from '../../models/Employee';

@injectable()
export class EmployeeCourseService implements IEmployeeCourseService {
  constructor(
    @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository,
    @inject(TYPES.CompanyOrderRepository) private _companyOrderRepo: ICompanyOrderRepository,
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository
  ) {}

  async getMyCourses(employeeId: string): Promise<IEmployee | null> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (!employee.companyId) throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.CONFLICT);

    const orders = await this._employeeRepo.getAssignedCourses(employeeId);
    console.log("order in service page ",orders)
    if (!orders) throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return orders;
  }

  async getMyCourseDetails(employeeId: string, courseId: string): Promise<ICourse | null> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (!employee.companyId) throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.CONFLICT);
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const orders = await this._companyOrderRepo.getOrdersById(employee.companyId.toString());
    const purchasedCourseIds = orders.flatMap(order => order.courses.map(c => c.toString()));
    if (!purchasedCourseIds.includes(courseId)) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }
}
