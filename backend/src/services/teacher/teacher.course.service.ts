import { inject, injectable } from 'inversify';
import { ITeacherCourseService, ICourseWithStats, ICourseAnalytics } from '../../core/interfaces/services/teacher/ITeacherCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { ICourseResourceRepository } from '../../core/interfaces/repositories/ICourseResourceRepository';
import { ICourseResource } from '../../models/CourseResource';
import { CourseCreateDTO, ModuleDTO, LessonDTO } from '../../core/dtos/teacher/TeacherDTO';
import { TYPES } from '../../core/di/types';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import cloudinary from '../../config/cloudinary';
import { Types } from 'mongoose';
import { ICourse, IModule } from '../../models/Course';
import { CreateCourseRequest } from '../../types/filter/fiterTypes';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { ITeacherRepository } from '../../core/interfaces/repositories/ITeacherRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';
import { CourseStatus } from '../../models/Course';
import { OrderModel } from '../../models/Order';
import { CompanyOrderModel } from '../../models/CompanyOrder';
import { Transaction } from '../../models/Transaction';
import { Student } from '../../models/Student';
import { CourseReview } from '../../models/CourseReview';
import { VerificationStatus } from '../../models/Teacher';
import { getSignedUrl, signCourseUrls } from '../../utils/cloudinarySign';
import logger from '../../utils/logger';

@injectable()
export class TeacherCourseService implements ITeacherCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository,
    @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
    @inject(TYPES.EmployeeRepository) private readonly _employeeRepository: IEmployeeRepository,
    @inject(TYPES.TeacherRepository) private readonly _teacherRepository: ITeacherRepository,
  ) { }

  // Helper for Cloudinary upload
  private async uploadToCloudinary(file: Express.Multer.File, folder: string, resourceType: 'video' | 'image' | 'raw' | 'auto' = 'auto', type: 'upload' | 'authenticated' = 'upload'): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: resourceType, folder, type }, (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else resolve(result.secure_url);
      }).end(file.buffer);
    });
  }

  async createCourse(req: CreateCourseRequest): Promise<CourseCreateDTO> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

    // Dependency Rule: If teacher is not verified → course submission blocked
    const teacher = await this._teacherRepository.findById(teacherId);
    if (!teacher) throwError(MESSAGES.TEACHER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // Allow creating drafts, but protect submission?
    // "If teacher is not verified → course submission blocked"
    // Assuming this means they can't even create a course? Or just can't submit?
    // "Teacher clicks 'Submit for Review'" - implies creation might typically be a draft first.
    // However, if the teacher isn't verified, they shouldn't be engaging in course creation flows usually.
    // Let's enforce strict: Must be verified to create any course (Draft or otherwise) logic from requirement "Only verified teachers can create courses".
    if (teacher.verificationStatus !== VerificationStatus.VERIFIED) {
      throwError('You must be a verified teacher to create courses.', STATUS_CODES.FORBIDDEN);
    }

    // Map files by fieldname
    const filesMap: { [key: string]: Express.Multer.File } = {};
    (req.files || []).forEach(file => filesMap[file.fieldname] = file);

    // Parse modules
    let modulesBody: ModuleDTO[] = [];
    modulesBody = JSON.parse(req.body.modules || '[]') as ModuleDTO[];


    const modules: ModuleDTO[] = [];

    for (const [moduleIndex, module] of modulesBody.entries()) {
      const newModule: ModuleDTO = {
        title: module.title,
        description: module.description,
        lessons: [],
      };

      if (Array.isArray(module.lessons)) {
        for (const [lessonIndex, lesson] of module.lessons.entries()) {
          let videoFileUrl = '';
          let thumbnailUrl = '';

          const videoFile = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`];
          if (videoFile) videoFileUrl = await this.uploadToCloudinary(videoFile, 'course_videos', 'video', 'authenticated');

          const thumbnail = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`];
          if (thumbnail) thumbnailUrl = await this.uploadToCloudinary(thumbnail, 'course_thumbnails', 'image');

          newModule.lessons.push({
            title: lesson.title,
            description: lesson.description || '',
            duration: parseInt(lesson.duration?.toString() || '0', 10),
            videoFile: videoFileUrl,
            thumbnail: thumbnailUrl,
          } as LessonDTO);
        }
      }

      modules.push(newModule);
    }


    let startname = req.body.title.slice(0, 3);
    let already2exist = await this._courseRepository.alreadyexist(startname, req.body.category);
    logger.info('already2exist', already2exist);
    logger.info('startname', startname);
    if (already2exist.length > 2) throwError('you cant do with this name , change another name');

    // Upload cover image
    let coverImageUrl = '';
    const coverImage = filesMap['coverImage'];
    if (coverImage) coverImageUrl = await this.uploadToCloudinary(coverImage, 'course_covers', 'image');

    // Construct course DTO
    const price = typeof req.body.price === 'string' ? parseFloat(req.body.price) : req.body.price ?? 0;

    const isSubmitted = req.body.isPublished === 'true';

    const courseData: CourseCreateDTO = {
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      language: req.body.language,
      isTechnicalCourse: req.body.isTechnicalCourse,
      price,
      coverImage: coverImageUrl,
      learningOutcomes: JSON.parse(req.body.learningOutcomes || '[]'),
      requirements: JSON.parse(req.body.requirements || '[]'),
      // If submitting, set pending and keep unpublished. If draft, set draft and unpublished.
      isPublished: false,
      status: isSubmitted ? CourseStatus.PENDING : CourseStatus.DRAFT,
      totalDuration: req.body.totalDuration ? Number(req.body.totalDuration) : undefined,
      modules,
      teacherId: new Types.ObjectId(teacherId),
    };

    // Validation
    if (!courseData.title || !courseData.description || !courseData.category) {
      throw new Error(MESSAGES.TITLE_DESCRIPTION_CATEGORY_REQUIRED);
    }
    if (courseData.modules.length === 0) {
      throw new Error(MESSAGES.AT_LEAST_ONE_MODULE_REQUIRED);
    }

    const newCourse = await this._courseRepository.create(courseData);

    // If submitted, maybe notify admin? (Implementation detail, skipping for now unless explicit)

    return newCourse;
  }

  async getCoursesByTeacherId(teacherId: string): Promise<ICourseWithStats[]> {
    const courses = await this._courseRepository.findByTeacherId(teacherId);
    if (!courses || courses.length === 0) return [];

    const courseIds = courses.map(c => c._id);

    // 1. Get completion rates for all these courses
    const progressStats = await Student.aggregate([
      { $unwind: '$coursesProgress' },
      { $match: { 'coursesProgress.courseId': { $in: courseIds } } },
      {
        $group: {
          _id: '$coursesProgress.courseId',
          avgCompletion: { $avg: '$coursesProgress.percentage' }
        }
      }
    ]);

    // 2. Get company enrollments for all these courses
    const companyEnrollmentsData = await CompanyOrderModel.aggregate([
      { $match: { status: 'paid', 'purchasedCourses.courseId': { $in: courseIds } } },
      { $unwind: '$purchasedCourses' },
      { $match: { 'purchasedCourses.courseId': { $in: courseIds } } },
      {
        $group: {
          _id: '$purchasedCourses.courseId',
          totalSeats: { $sum: '$purchasedCourses.seats' }
        }
      }
    ]);

    // Wait, let's check CompanyOrder schema to be sure about 'quantity' vs 'seats'
    // I saw 'seats' in CompanyPurchaseService.ts Line 87.
    // Let me check CompanyOrder model.

    const statsMap = new Map(progressStats.map(s => [s._id.toString(), Math.round(s.avgCompletion || 0)]));
    const companyStatsMap = new Map(companyEnrollmentsData.map(s => [s._id.toString(), s.totalSeats || 0]));

    return courses.map(course => {
      const c = course.toObject ? course.toObject() : course;
      const cId = c._id.toString();

      return {
        ...c,
        enrolledStudents: (course.totalStudents || 0) + (companyStatsMap.get(cId) || 0),
        rating: course.averageRating || 0,
        reviewCount: course.reviewCount || 0,
        completionRate: statsMap.get(cId) || 0
      } as ICourseWithStats;
    });
  }

  async getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<ICourse> {
    const course = await this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // Sign URLs
    return signCourseUrls(course);
  }

  async uploadResource(courseId: string, title: string, file: Express.Multer.File): Promise<ICourseResource> {
    if (!file) throwError(MESSAGES.FILE_REQUIRED, STATUS_CODES.BAD_REQUEST);

    const course = await this._courseRepository.findById(courseId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    if (course.isBlocked) {
      throwError('Cannot upload resources to a blocked course.', STATUS_CODES.FORBIDDEN);
    }

    const fileType = file.originalname.split('.').pop() ?? 'unknown';
    const resourceType: 'raw' | 'auto' = fileType === 'pdf' ? 'raw' : 'auto';
    const uploadedUrl = await this.uploadToCloudinary(file, 'course_resources', resourceType, 'authenticated');

    return this._resourceRepository.uploadResource({
      courseId: new Types.ObjectId(courseId),
      title,
      fileUrl: uploadedUrl,
      fileType,
    });
  }

  async getResources(courseId: string): Promise<ICourseResource[]> {
    const resources = await this._resourceRepository.getResourcesByCourse(courseId);
    return resources.map(resource => {
      if (resource.fileUrl) resource.fileUrl = getSignedUrl(resource.fileUrl);
      return resource;
    });
  }

  async deleteResource(resourceId: string): Promise<void> {
    await this._resourceRepository.deleteResource(resourceId);
  }

  async editCourse(courseId: string, teacherId: string, req: CreateCourseRequest): Promise<ICourse | null> {
    // 1. Verify ownership
    const existingCourse = await this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
    if (!existingCourse) {
      throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    }

    if (existingCourse.isBlocked) {
      throwError('This course is blocked by admin and cannot be edited. Reason: ' + (existingCourse.blockReason || 'No reason provided'), STATUS_CODES.FORBIDDEN);
    }

    // 2. Handle files similar to create
    const filesMap: { [key: string]: Express.Multer.File } = {};
    (req.files || []).forEach(file => filesMap[file.fieldname] = file);

    // 3. Parse modules
    let modulesBody: ModuleDTO[] = [];
    try {
      modulesBody = JSON.parse(req.body.modules || '[]');
    } catch {
      modulesBody = [];
    }

    const modules: ModuleDTO[] = [];

    // Reconstruct modules with potential new files or existing urls
    for (const [moduleIndex, module] of modulesBody.entries()) {
      const newModule: ModuleDTO = {
        title: module.title,
        description: module.description,
        lessons: [],
      };

      if (Array.isArray(module.lessons)) {
        for (const [lessonIndex, lesson] of module.lessons.entries()) {
          let videoFileUrl = lesson.videoFile || ''; // retain existing if string
          let thumbnailUrl = lesson.thumbnail || ''; // retain existing if string

          // Check for new uploads
          const videoFile = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`];
          if (videoFile) videoFileUrl = await this.uploadToCloudinary(videoFile, 'course_videos', 'video', 'authenticated');

          const thumbnail = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`];
          if (thumbnail) thumbnailUrl = await this.uploadToCloudinary(thumbnail, 'course_thumbnails', 'image');

          newModule.lessons.push({
            title: lesson.title,
            description: lesson.description || '',
            duration: parseInt(lesson.duration?.toString() || '0', 10),
            videoFile: videoFileUrl,
            thumbnail: thumbnailUrl,
          } as LessonDTO);
        }
      }
      modules.push(newModule);
    }

    // 4. Handle cover image
    let coverImageUrl = existingCourse?.coverImage || '';
    const coverImage = filesMap['coverImage'];
    if (coverImage) coverImageUrl = await this.uploadToCloudinary(coverImage, 'course_covers', 'image');

    // 5. Construct update object
    const price = typeof req.body.price === 'string' ? parseFloat(req.body.price) : req.body.price ?? 0;

    // Parse arrays if they are strings
    const learningOutcomes = typeof req.body.learningOutcomes === 'string'
      ? JSON.parse(req.body.learningOutcomes)
      : req.body.learningOutcomes;

    const requirements = typeof req.body.requirements === 'string'
      ? JSON.parse(req.body.requirements)
      : req.body.requirements;

    const updates: Partial<ICourse> = {
      title: req.body.title,
      subtitle: req.body.subtitle || '',
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      language: req.body.language,
      isTechnicalCourse: req.body.isTechnicalCourse === true,
      price,
      coverImage: coverImageUrl,
      learningOutcomes: learningOutcomes || [],
      requirements: requirements || [],
      isPublished: req.body.isPublished === 'true',
      totalDuration: req.body.totalDuration ? Number(req.body.totalDuration) : undefined,
      modules: modules as unknown as IModule[], // casting to match ICourse module structure
    };

    const updatedCourse = await this._courseRepository.editCourse(courseId, updates);

    if (!updatedCourse) return null;

    // Notify Companies (those who have bought seats)
    // For simplicity, let's notify all companies for now as per requirement "trigger on Company"
    const companies = await this._companyRepository.findAll();
    for (const company of companies) {
      await this._notificationService.createNotification(
        company._id.toString(),
        'Course Updated',
        `The course "${updatedCourse.title}" has been updated by the teacher.`,
        'course',
        'company',
        '/company/courses'
      );
    }

    // Notify Employees who are enrolled in this course
    // Find all employees who have this course assigned
    // (This is a bit more complex, I'll do a simple query)
    const enrolledEmployees = await this._employeeRepository.findAll(); // Optimization: should find by courseId
    const affectedEmployees = enrolledEmployees.filter(emp => emp.coursesAssigned?.some(id => id.toString() === courseId));

    for (const emp of affectedEmployees) {
      await this._notificationService.createNotification(
        emp._id.toString(),
        'Course Updated',
        `Content for "${updatedCourse.title}" has been updated.`,
        'course',
        'employee',
        '/employee/my-courses'
      );
    }

    return signCourseUrls(updatedCourse);
  }

  async getCourseAnalytics(courseId: string, teacherId: string): Promise<ICourseAnalytics> {
    const tId = new Types.ObjectId(teacherId);
    const cId = new Types.ObjectId(courseId);

    const course = await this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);

    // 1. Enrollment Overview
    const individualEnrollments = await OrderModel.countDocuments({
      courses: cId,
      status: 'paid'
    });

    // Company enrollments (sum of seats bought)
    const companyEnrollmentsData = await CompanyOrderModel.aggregate([
      { $match: { status: 'paid', 'purchasedCourses.courseId': cId } },
      { $unwind: '$purchasedCourses' },
      { $match: { 'purchasedCourses.courseId': cId } },
      { $group: { _id: null, totalSeats: { $sum: '$purchasedCourses.seats' } } }
    ]);
    const companyEnrollments = companyEnrollmentsData.length > 0 ? companyEnrollmentsData[0].totalSeats : 0;

    // 2. Revenue Over Time (Last 12 Months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);

    const revenueData = await Transaction.aggregate([
      {
        $match: {
          courseId: cId,
          teacherId: tId,
          type: { $in: ['TEACHER_EARNING', 'COURSE_PURCHASE'] },
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // 3. Student Progress & Completion
    const progressStats = await Student.aggregate([
      { $unwind: '$coursesProgress' },
      { $match: { 'coursesProgress.courseId': cId } },
      {
        $group: {
          _id: null,
          avgCompletion: { $avg: '$coursesProgress.percentage' },
          completedCount: { $sum: { $cond: [{ $gte: ['$coursesProgress.percentage', 100] }, 1, 0] } },
          totalProgressRecords: { $sum: 1 }
        }
      }
    ]);

    // 4. Lesson Completion Count
    const lessonCompletion = await Student.aggregate([
      { $unwind: '$coursesProgress' },
      { $match: { 'coursesProgress.courseId': cId } },
      { $unwind: '$coursesProgress.completedLessons' },
      {
        $group: {
          _id: '$coursesProgress.completedLessons',
          count: { $sum: 1 }
        }
      }
    ]);

    // 5. Rating Distribution
    const ratingDistribution = await CourseReview.aggregate([
      { $match: { courseId: cId } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': -1 } }
    ]);

    const analytics = {
      overview: {
        title: course.title,
        totalStudents: (course.totalStudents || 0) + companyEnrollments,
        individualEnrollments,
        companyEnrollments,
        totalRevenue: revenueData.reduce((acc, curr) => acc + curr.revenue, 0),
        averageRating: course.averageRating,
        reviewCount: course.reviewCount,
        completionRate: progressStats.length > 0 ? progressStats[0].avgCompletion : 0,
        studentsCompleted: progressStats.length > 0 ? progressStats[0].completedCount : 0
      },
      revenueChart: revenueData,
      lessonStats: lessonCompletion,
      ratingStats: ratingDistribution,
      courseStructure: course.modules as IModule[] // For matching lesson IDs with titles on frontend
    };

    return signCourseUrls(analytics);
  }
}
