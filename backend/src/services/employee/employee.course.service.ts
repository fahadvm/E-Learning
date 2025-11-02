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
import { ICourseProgress, IEmployee } from '../../models/Employee';
import { ICourseResource } from '../../models/CourseResource';
import { ICourseResourceRepository } from '../../core/interfaces/repositories/ICourseResourceRepository';
import { IEmployeeLearningRecord } from '../../models/EmployeeLearningRecord';

@injectable()
export class EmployeeCourseService implements IEmployeeCourseService {
  constructor(
    @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository,
    @inject(TYPES.CompanyOrderRepository) private _companyOrderRepo: ICompanyOrderRepository,
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository,
  ) { }

  async getMyCourses(employeeId: string): Promise<IEmployee | null> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (!employee.companyId) throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.CONFLICT);

    const orders = await this._employeeRepo.getAssignedCourses(employeeId);
    console.log("order in service page ", orders)
    if (!orders) throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return orders;
  }

  async getMyCourseDetails(employeeId: string, courseId: string): Promise<{ course: ICourse; progress: ICourseProgress }> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (!employee.companyId) throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.CONFLICT);
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);

    const orders = await this._companyOrderRepo.getOrdersById(employee.companyId.toString());
    const purchasedCourseIds = orders.flatMap(order => order.courses.map(c => c.toString()));
    if (!purchasedCourseIds.includes(courseId)) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const progress = await this._employeeRepo.getOrCreateCourseProgress(employeeId, courseId);
    return { course, progress };
  }

  async markLessonComplete(
    employeeId: string,
    courseId: string,
    lessonId: string
  ): Promise<ICourseProgress> {

    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const progress = await this._employeeRepo.updateEmployeeProgress(employeeId, courseId, lessonId);
    return progress;
  }


  async addLearningTime(employeeId: string, courseId: string,  seconds: number): Promise<IEmployeeLearningRecord> {
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
     const minutes = seconds / 60
    const record = await this._employeeRepo.updateLearningTime(employeeId, courseId, date , minutes);
    return record;

  }

  async saveNotes(employeeId: string, courseId: string, notes: string): Promise<ICourseProgress> {
    if (!notes) notes = '// Write your thoughts or doubts here';
    if (!courseId) throwError(MESSAGES.REQUIRED_FIELDS_MISSING, STATUS_CODES.NOT_FOUND);
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    const saving = await this._employeeRepo.saveNotes(employeeId, courseId, notes);
    return saving;
  }
  async getResources(courseId: string): Promise<ICourseResource[]> {
    return this._resourceRepository.getResourcesByCourse(courseId);
  }
}
