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
import { IEmployeeLearningPathRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathRepository';
import { IEmployeeLearningPathProgressRepository } from '../../core/interfaces/repositories/IEmployeeLearningPathProgressRepository';
import { updateCompanyLeaderboard } from '../../utils/redis/leaderboard';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';

@injectable()
export class EmployeeCourseService implements IEmployeeCourseService {
  constructor(
    @inject(TYPES.EmployeeRepository) private _employeeRepo: IEmployeeRepository,
    @inject(TYPES.CompanyOrderRepository) private _companyOrderRepo: ICompanyOrderRepository,
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository,
    @inject(TYPES.EmployeeLearningPathProgressRepository) private readonly _LearnigPathRepo: IEmployeeLearningPathProgressRepository,
    @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
  ) { }

  async getMyCourses(employeeId: string): Promise<IEmployee | null> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (!employee.companyId) throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.CONFLICT);

    const orders = await this._employeeRepo.getAssignedCourses(employeeId);
    if (!orders) throwError(MESSAGES.ORDER_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return orders;
  }

  async getMyCourseDetails(employeeId: string, courseId: string): Promise<{ course: ICourse; progress: ICourseProgress }> {
    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (!employee.companyId) throwError(MESSAGES.NOT_PART_OF_COMPANY, STATUS_CODES.CONFLICT);
    if (!courseId) throwError(MESSAGES.INVALID_ID, STATUS_CODES.BAD_REQUEST);
    const orders = await this._companyOrderRepo.getOrdersById(employee.companyId.toString());

    const purchasedCourseIds = orders.flatMap(order => order.purchasedCourses.map(c => c.courseId._id.toString()));

    if (!purchasedCourseIds.includes(courseId)) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (course.isBlocked) {
      throwError('Course access disabled by admin. Reason: ' + (course.blockReason || 'No reason provided'), STATUS_CODES.FORBIDDEN);
    }

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

    if (course.isBlocked) {
      throwError('Cannot complete lessons for a blocked course.', STATUS_CODES.FORBIDDEN);
    }

    // Fetch old progress to compare
    const oldProgress = await this._employeeRepo.getOrCreateCourseProgress(employeeId, courseId);
    const oldCompletedModulesCount = oldProgress.completedModules?.length || 0;

    const progress = await this._employeeRepo.updateEmployeeProgress(employeeId, courseId, lessonId);
    const learningPathProgress = await this._LearnigPathRepo.updateLearningPathProgress(employeeId, courseId, progress.percentage);

    const employee = await this._employeeRepo.findById(employeeId);

    // Check if a new module was unlocked
    const newCompletedModulesCount = progress.completedModules?.length || 0;
    if (newCompletedModulesCount > oldCompletedModulesCount) {
      // Find the next module
      const nextModule = course.modules[newCompletedModulesCount];

    }

    // Notify on Course Completion
    if (progress.percentage === 100) {
      // Notify Employee
      await this._notificationService.createNotification(
        employeeId,
        'Course Completed!',
        `Congratulations! You have completed the course: ${course.title}.`,
        'course-complete',
        'employee'
      );

      // Notify Company
      if (employee?.companyId) {
        await this._notificationService.createNotification(
          employee.companyId.toString(),
          'Employee Completed Course',
          `${employee.name} has completed the course: ${course.title}.`,
          'course-complete',
          'company',
          `/company/employees/${employeeId}`
        );
      }
    }

    // Notify on Learning Path Completion
    if (learningPathProgress.status === 'completed') {
      // Notify Employee
      await this._notificationService.createNotification(
        employeeId,
        'Learning Path Finished!',
        `Amazing work! You have finished the entire learning path.`,
        'learning-path-complete',
        'employee'
      );

      // Notify Company
      if (employee?.companyId) {
        await this._notificationService.createNotification(
          employee.companyId.toString(),
          'Learning Path Completed',
          `${employee.name} has finished an assigned learning path.`,
          'learning-path-complete',
          'company',
          `/company/employees/${employeeId}`
        );
      }
    }

    return progress;
  }


  async addLearningTime(employeeId: string, courseId: string, seconds: number): Promise<IEmployeeLearningRecord> {
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    if (course.isBlocked) {
      throwError('Learning time cannot be recorded for a blocked course.', STATUS_CODES.FORBIDDEN);
    }

    const today = new Date();
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minutes = seconds / 60;

    const record = await this._employeeRepo.updateLearningTime(employeeId, courseId, date, minutes);

    const employee = await this._employeeRepo.findById(employeeId);
    if (!employee) throwError(MESSAGES.EMPLOYEE_NOT_FOUND, STATUS_CODES.NOT_FOUND)
    const companyId = employee?.companyId?.toString();
    if (companyId) {
      const completedCourses = employee.coursesProgress?.filter(c => c.percentage === 100).length || 0;
      const streakCount = employee.streakCount || 0;
      const totalMinutes = await this._employeeRepo.getTotalMinutes(employeeId, companyId);

      await updateCompanyLeaderboard(companyId, employeeId, totalMinutes, completedCourses, streakCount);
    }

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
    const course = await this._courseRepo.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (course.isBlocked) {
      throwError('Course resources are unavailable as the course is blocked by admin.', STATUS_CODES.FORBIDDEN);
    }
    return this._resourceRepository.getResourcesByCourse(courseId);
  }
  async getProgress(employeeId: string): Promise<ICourseProgress[] | null> {
    return this._employeeRepo.getProgress(employeeId);
  }
  async getLearningRecords(employeeId: string): Promise<any> {
    return this._employeeRepo.getLearningRecords(employeeId);
  }
}
