import { injectable } from 'inversify';
import { ICourseRepository } from '../core/interfaces/repositories/course/ICourseRepository';
import { ICourse, Course } from '../models/course';

@injectable()
export class CourseRepository implements ICourseRepository {
  async create(courseData: Partial<ICourse>): Promise<ICourse> {
    return await Course.create(courseData);
  }

  async findByTeacherId(teacherId: string): Promise<ICourse[]> {
    return await Course.find({ teacherId });
  }

  async findByIdAndTeacherId(courseId: string, teacherId: string): Promise<ICourse | null> {
    return await Course.findOne({ _id: courseId, teacherId });
  }
  

  async findAllCourses(): Promise<ICourse[]> {
    return await Course.find().populate('teacherId', 'name email');
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).populate('teacherId', 'name email');
  }

  async findAll({ skip, limit, search }: { skip: number; limit: number; search?: string }): Promise<ICourse[]> {
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    return Course.find(query).skip(skip).limit(limit).lean();
  }

  async count(search?: string): Promise<number> {
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    return Course.countDocuments(query);
  }

  async findUnverified(): Promise<ICourse[]> {
    return Course.find({ status: 'pending' }).lean();
  }

  async findById(courseId: string): Promise<ICourse | null> {
    return Course.findById(courseId).lean();
  }

  async updateStatus(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(courseId, updates, { new: true }).lean();
  }
}
