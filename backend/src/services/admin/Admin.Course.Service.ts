import { inject, injectable } from 'inversify';
import { IAdminCourseService } from '../../core/interfaces/services/admin/IAdminCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { IOrderRepository } from '../../core/interfaces/repositories/IOrderRepository';
import { TYPES } from '../../core/di/types';
import { IAdminCourseDTO, AdminCourseDTO, PaginatedCourseDTO } from '../../core/dtos/admin/Admin.course.Dto';
import { broadcastEvent } from '../../config/socket';
import { CourseStatus } from '../../models/Course';

import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { signCourseUrls } from '../../utils/cloudinarySign';

@injectable()
export class AdminCourseService implements IAdminCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepo: ICourseRepository,
    @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
    @inject(TYPES.OrderRepository) private readonly _orderRepository: IOrderRepository,
  ) { }

  async getAllCourses(page: number, limit: number, search?: string): Promise<PaginatedCourseDTO> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this._courseRepo.findAll({ skip, limit, search }),
      this._courseRepo.count(search),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { data: data.map(AdminCourseDTO), total, totalPages };
  }

  async getUnverifiedCourses(): Promise<IAdminCourseDTO[]> {
    const courses = await this._courseRepo.findUnverified();
    return courses.map(AdminCourseDTO);
  }

  async getCourseById(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.findById(courseId);
    if (!course) return null;

    // Sign URLs for admin preview
    const signedCourse = signCourseUrls(course);

    return AdminCourseDTO(signedCourse);
  }

  async verifyCourse(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, {
      status: CourseStatus.PUBLISHED,
      isVerified: true,
      isPublished: true
    });

    if (course) {
      // Notify Teacher
      if (course.teacherId) {
        await this._notificationService.createNotification(
          typeof course.teacherId === 'string' ? course.teacherId : course.teacherId._id.toString(),
          'Course Approved',
          `Your course "${course.title}" has been approved and published.`,
          'course',
          'teacher',
          '/teacher/courses'
        );
      }

      // Notify Companies
      const companies = await this._companyRepository.findAll();
      for (const company of companies) {
        await this._notificationService.createNotification(
          company._id.toString(),
          'New Course Available',
          `A new course "${course.title}" has been published.`,
          'course',
          'company',
          '/company/courses'
        );
      }
    }

    return course ? AdminCourseDTO(course) : null;
  }

  async rejectCourse(courseId: string, remarks: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, {
      status: CourseStatus.REJECTED,
      isVerified: false,
      isPublished: false,
      adminRemarks: remarks
    });

    if (course && course.teacherId) {
      await this._notificationService.createNotification(
        typeof course.teacherId === 'string' ? course.teacherId : course.teacherId._id.toString(),
        'Course Rejected',
        `Your course "${course.title}" has been rejected. Remarks: ${remarks}`,
        'course',
        'teacher',
        '/teacher/courses'
      );
    }

    return course ? AdminCourseDTO(course) : null;
  }

  async blockCourse(courseId: string, reason: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, { isBlocked: true, blockReason: reason });

    if (course) {
      broadcastEvent('courseBlocked', {
        courseId,
        reason,
        message: 'This course has been blocked by admin.'
      });
    }

    return course ? AdminCourseDTO(course) : null;
  }

  async unblockCourse(courseId: string): Promise<IAdminCourseDTO | null> {
    const course = await this._courseRepo.updateStatus(courseId, { isBlocked: false, blockReason: '' });

    if (course) {
      broadcastEvent('courseUnblocked', { courseId });
    }

    return course ? AdminCourseDTO(course) : null;
  }

  async getCourseAnalytics(courseId: string) {
    return await this._orderRepository.getEnrolmentAnalytics(courseId);
  }
}
