import { inject, injectable } from 'inversify';
import { ITeacherCourseService } from '../../core/interfaces/services/teacher/ITeacherCourseService';
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
import { ICourse } from '../../models/Course';
import { CreateCourseRequest } from '../../types/filter/fiterTypes';
import { INotificationService } from '../../core/interfaces/services/shared/INotificationService';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { IEmployeeRepository } from '../../core/interfaces/repositories/IEmployeeRepository';



@injectable()
export class TeacherCourseService implements ITeacherCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository,
    @inject(TYPES.NotificationService) private readonly _notificationService: INotificationService,
    @inject(TYPES.CompanyRepository) private readonly _companyRepository: ICompanyRepository,
    @inject(TYPES.EmployeeRepository) private readonly _employeeRepository: IEmployeeRepository,
  ) { }

  // Helper for Cloudinary upload
  private async uploadToCloudinary(file: Express.Multer.File, folder: string, resourceType: 'video' | 'image' | 'raw' | 'auto' = 'auto'): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: resourceType, folder }, (error, result) => {
        if (error || !result) reject(error || new Error('Upload failed'));
        else resolve(result.secure_url);
      }).end(file.buffer);
    });
  }

  async createCourse(req: CreateCourseRequest): Promise<CourseCreateDTO> {
    const teacherId = req.user?.id;
    if (!teacherId) throwError(MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED);

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
          if (videoFile) videoFileUrl = await this.uploadToCloudinary(videoFile, 'course_videos', 'video');

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

    // Upload cover image
    let coverImageUrl = '';
    const coverImage = filesMap['coverImage'];
    if (coverImage) coverImageUrl = await this.uploadToCloudinary(coverImage, 'course_covers', 'image');

    // Construct course DTO
    const price = typeof req.body.price === 'string' ? parseFloat(req.body.price) : req.body.price ?? 0;
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
      isPublished: req.body.isPublished === 'true',
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

    if (newCourse.isPublished) {
      const companies = await this._companyRepository.findAll();
      for (const company of companies) {
        await this._notificationService.createNotification(
          company._id.toString(),
          'New Course Available',
          `A new course "${newCourse.title}" has been published.`,
          'course',
          'company',
          '/company/courses'
        );
      }
    }

    return newCourse;
  }

  async getCoursesByTeacherId(teacherId: string): Promise<ICourse[]> {
    return this._courseRepository.findByTeacherId(teacherId);
  }

  async getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<ICourse> {
    const course = await this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
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
    const uploadedUrl = await this.uploadToCloudinary(file, 'course_resources', resourceType);

    return this._resourceRepository.uploadResource({
      courseId: new Types.ObjectId(courseId),
      title,
      fileUrl: uploadedUrl,
      fileType,
    });
  }

  async getResources(courseId: string): Promise<ICourseResource[]> {
    return this._resourceRepository.getResourcesByCourse(courseId);
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
    } catch (e) {
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
          if (videoFile) videoFileUrl = await this.uploadToCloudinary(videoFile, 'course_videos', 'video');

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
      modules: modules as any, // casting to any to match ICourse module structure if strict typing complains
    };

    const updatedCourse = await this._courseRepository.editCourse(courseId, updates);

    if (updatedCourse) {
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
    }

    return updatedCourse;
  }
}
