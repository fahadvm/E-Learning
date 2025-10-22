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



@injectable()
export class TeacherCourseService implements ITeacherCourseService {
  constructor(
    @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository,
    @inject(TYPES.CourseResourceRepository) private readonly _resourceRepository: ICourseResourceRepository,
  ) {}

  // Helper for Cloudinary upload
  private async uploadToCloudinary(file: Express.Multer.File, folder: string, resourceType: 'video' | 'image' | 'raw'| 'auto' = 'auto'): Promise<string> {
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
      price,
      coverImage: coverImageUrl,
      learningOutcomes: JSON.parse(req.body.learningOutcomes || '[]'),
      requirements: JSON.parse(req.body.requirements || '[]'),
      isPublished: req.body.isPublished === 'true',
      totalDuration: req.body.totalDuration ? Number(req.body.totalDuration) : undefined,
      modules,
      teacherId :new Types.ObjectId(teacherId),
    };

    // Validation
    if (!courseData.title || !courseData.description || !courseData.category) {
      throw new Error(MESSAGES.TITLE_DESCRIPTION_CATEGORY_REQUIRED);
    }
    if (courseData.modules.length === 0) {
      throw new Error(MESSAGES.AT_LEAST_ONE_MODULE_REQUIRED);
    }

    return this._courseRepository.create(courseData);
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
}
