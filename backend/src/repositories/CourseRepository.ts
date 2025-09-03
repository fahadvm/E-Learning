import { injectable } from 'inversify';
import { ICourseRepository } from '../core/interfaces/repositories/ICourseRepository';
import { ICourse, Course } from '../models/course';
import { FilterQuery, SortOrder } from "mongoose";


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
  

async findAllCourses(
  query: FilterQuery<ICourse>,
  sort: Record<string, SortOrder>,
  skip: number,
  limit: number
): Promise<ICourse[]> {
  return Course.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();
}

  async countAllCourses(query: any): Promise<number> {
    return await Course.countDocuments(query).exec();
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).populate('teacherId', 'name email');
  }

async findAll({ skip, limit, search }: { skip: number; limit: number; search?: string }): Promise<ICourse[]> {
  const query = search ? { title: { $regex: search, $options: 'i' } } : {};
  const course = await Course.find(query).populate({ path: 'teacherId', select:' name ' }).skip(skip).limit(limit).lean();
  return course;
}

  async count(search?: string): Promise<number> {
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    return Course.countDocuments(query);
  }

  async findUnverified(): Promise<ICourse[]> {
    return Course.find({ status: 'pending' }).lean();
  }

  async findById(courseId: string): Promise<ICourse | null> {
  return Course.findById(courseId)
    .populate('teacherId', 'name email profilePicture about') 
    .lean();
}

  async updateStatus(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(courseId, updates, { new: true }).lean();
  }
}
