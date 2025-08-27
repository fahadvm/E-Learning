import { inject, injectable } from 'inversify';
import { ITeacherCourseService } from '../../core/interfaces/services/teacher/ITeacherCourseService';
import { ICourseRepository } from '../../core/interfaces/repositories/ICourseRepository';
import { throwError } from '../../utils/ResANDError';
import { STATUS_CODES } from '../../utils/HttpStatuscodes';
import { MESSAGES } from '../../utils/ResponseMessages';
import { TYPES } from '../../core/di/types';
import { ICourse,   } from '../../models/course';
import cloudinary from '../../config/cloudinary';
import { CourseCreateDTO ,ModuleDTO , LessonDTO } from '../../core/dtos/teacher/TeacherDTO';

@injectable()
export class TeacherCourseService implements ITeacherCourseService {
  constructor(
    @inject(TYPES.CourseRepository)
    private readonly _courseRepository: ICourseRepository
  ) {}

  async createCourse(req: any): Promise<CourseCreateDTO> {
  const teacherId = req.user?.id;
  if (!teacherId) throw new Error(MESSAGES.UNAUTHORIZED);

  // Map files by fieldname
  const filesMap: { [key: string]: Express.Multer.File } = {};
  (req.files as Express.Multer.File[] || []).forEach(file => {
    filesMap[file.fieldname] = file;
  });

  // Parse modules JSON from frontend
  let modulesBody: any[] = [];
  try {
    modulesBody = JSON.parse(req.body.modules || '[]');
  } catch (error) {
    console.error('Failed to parse modules:', error);
    throw new Error('Invalid modules format');
  }

  const modules: ModuleDTO[] = [];

  for (const [moduleIndex, module] of modulesBody.entries()) {
    const newModule: ModuleDTO = {
      title: module.title,
      lessons: [],
    };

    if (Array.isArray(module.lessons)) {
      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        let videoFileUrl = '';
        let thumbnailUrl = '';

        // Upload lesson video
        const videoFile = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][videoFile]`];
        if (videoFile) {
          try {
            videoFileUrl = await new Promise<string>((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                { resource_type: 'video', folder: 'course_videos' },
                (error, result) => {
                  if (error || !result) reject(new Error('Cloudinary video upload failed'));
                  else resolve(result.secure_url);
                }
              ).end(videoFile.buffer);
            });
          } catch (error) {
            console.error(`Video upload failed for module ${moduleIndex}, lesson ${lessonIndex}:`, error);
          }
        }

        // Upload lesson thumbnail
        const thumbnail = filesMap[`modules[${moduleIndex}][lessons][${lessonIndex}][thumbnail]`];
        if (thumbnail) {
          try {
            thumbnailUrl = await new Promise<string>((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'course_thumbnails' },
                (error, result) => {
                  if (error || !result) reject(new Error('Cloudinary thumbnail upload failed'));
                  else resolve(result.secure_url);
                }
              ).end(thumbnail.buffer);
            });
          } catch (error) {
            console.error(`Thumbnail upload failed for module ${moduleIndex}, lesson ${lessonIndex}:`, error);
          }
        }

        newModule.lessons.push({
          title: lesson.title,
          description: lesson.description || '',
          duration: parseInt(lesson.duration) || 0,
          videoFile: videoFileUrl,
          thumbnail: thumbnailUrl,
        });
      }
    }

    modules.push(newModule);
  }

  // Upload cover image
  let coverImageUrl = '';
  const coverImage = filesMap['coverImage'];
  if (coverImage) {
    try {
      coverImageUrl = await new Promise<string>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'course_covers' },
          (error, result) => {
            if (error || !result) reject(new Error('Cloudinary cover image upload failed'));
            else resolve(result.secure_url);
          }
        ).end(coverImage.buffer);
      });
    } catch (error) {
      console.error('Cover image upload failed:', error);
    }
  }

  // Construct course DTO
  const courseData: CourseCreateDTO = {
    title: req.body.title,
    subtitle: req.body.subtitle || '',
    description: req.body.description,
    category: req.body.category,
    level: req.body.level,
    language: req.body.language,
    price: parseFloat(req.body.price || '0'),
    coverImage: coverImageUrl,
    learningOutcomes: JSON.parse(req.body.learningOutcomes || '[]'),
    requirements: JSON.parse(req.body.requirements || '[]'),
    isPublished: req.body.isPublished === 'true',
    modules,
    teacherId,
  };

  // Validation
  if (!courseData.title || !courseData.description || !courseData.category) {
    throw new Error(MESSAGES.TITLE_DESCRIPTION_CATEGORY_REQUIRED);
  }
  if (courseData.modules.length === 0) {
    throw new Error(MESSAGES.AT_LEAST_ONE_MODULE_REQUIRED);
  }

  return await this._courseRepository.create(courseData);
}


  async getCoursesByTeacherId(teacherId: string): Promise<any[]> {
    const courses = await this._courseRepository.findByTeacherId(teacherId);
    // if (!courses || courses.length === 0) {
    //   throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    // }
    return courses;
  }

  async getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<any> {
    const course = await this._courseRepository.findByIdAndTeacherId(courseId, teacherId);
    if (!course) throwError(MESSAGES.COURSE_NOT_FOUND, STATUS_CODES.NOT_FOUND);
    return course;
  }
}
