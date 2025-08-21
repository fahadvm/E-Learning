
import { Request } from 'express';
import { ICourse } from '../../../../models/course';
import { CourseCreateDTO } from '../../../../core/dtos/teacher/TeacherDTO';
export interface ITeacherCourseService {
  createCourse(req: Request): Promise<CourseCreateDTO>;
  getCoursesByTeacherId(teacherId: string): Promise<ICourse[]>;
  getCourseByIdWithTeacherId(courseId: string, teacherId: string): Promise<ICourse | null>;
}
