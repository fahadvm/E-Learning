
import { ICourse } from '../../../../models/Course';
import { CourseCreateDTO } from '../../../../core/dtos/teacher/TeacherDTO';
import { ICourseResource } from '../../../../models/CourseResource';
import { CreateCourseRequest } from '../../../../types/filter/fiterTypes';
export interface ITeacherCourseService {
  createCourse(req: CreateCourseRequest): Promise<CourseCreateDTO>;
  getCoursesByTeacherId(teacherId: string): Promise<ICourse[]>;
  getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<ICourse | null>;
  uploadResource(courseId: string, title: string, file: Express.Multer.File): Promise<ICourseResource>;
  getResources(courseId: string): Promise<ICourseResource[]>;
  deleteResource( resourceId: string): Promise<void>;
}
