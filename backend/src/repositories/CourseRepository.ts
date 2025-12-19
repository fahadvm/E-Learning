import { injectable } from 'inversify';
import { ICourseRepository } from '../core/interfaces/repositories/ICourseRepository';
import { ICourse, Course } from '../models/Course';
import { FilterQuery, SortOrder } from 'mongoose';

@injectable()
export class CourseRepository implements ICourseRepository {
  async create(courseData: Partial<ICourse>): Promise<ICourse> {
    return await Course.create(courseData);
  }

  async getFilteredCourses(
    filters: {
      search?: string;
      category?: string;
      level?: string;
      language?: string;
      sort?: string;
      order?: 'asc' | 'desc';
      page?: number;
      limit?: number;
    }): Promise<{ data: ICourse[]; totalPages: number; totalCount: number }> {
    const {
      search,
      category,
      level,
      language,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 8,
      isBlocked,
      isPublished,
    } = filters;

    const query: FilterQuery<ICourse> = {};

    if (isBlocked !== undefined) query.isBlocked = isBlocked;
    if (isPublished !== undefined) query.isPublished = isPublished;

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) query.category = category;
    if (level) query.level = level;
    if (language) query.language = language;

    const skip = (page - 1) * limit;

    const totalCount = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    const data = await Course.find(query)
      .sort({ [sort]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    return { data, totalPages, totalCount };
  }

  async findByTeacherId(teacherId: string): Promise<ICourse[]> {
    return await Course.find({ teacherId });
  }

  async findByIdAndTeacherId(courseId: string, teacherId: string): Promise<ICourse | null> {
    return await Course.findOne({ _id: courseId, teacherId });
  }

  async getPremiumCourses(): Promise<ICourse[]> {
    return await Course.find({});
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

  async countAllCourses(query: FilterQuery<ICourse>): Promise<number> {
    return await Course.countDocuments(query).exec();
  }

  async findCourseById(courseId: string): Promise<ICourse | null> {
    return await Course.findById(courseId).populate('teacherId', 'name email');
  }

  async findAll({ skip, limit, search }: { skip: number; limit: number; search?: string }): Promise<ICourse[]> {
    const query = search ? { title: { $regex: search, $options: 'i' } } : {};
    const course = await Course.find(query).populate({ path: 'teacherId', select: ' name ' }).skip(skip).limit(limit).lean();
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

  async incrementStudentCount(courseId: string): Promise<void> {
    await Course.findByIdAndUpdate(
      courseId,
      { $inc: { totalStudents: 1 } },
      { new: true }
    );
  }

  async findRecommendedCourses(
    courseId: string,
    category: string,
    level: string,
    limit: number
  ): Promise<ICourse[]> {
    return Course.find({
      _id: { $ne: courseId },
      $or: [
        { category },
        { level }
      ],
      isPublished: true,
      isBlocked: false
    })
      .sort({ totalStudents: -1 })
      .limit(limit)
      .lean();
  }

  async editCourse(courseId: string, updates: Partial<ICourse>): Promise<ICourse | null> {
    return await Course.findByIdAndUpdate(courseId, { $set: updates }, { new: true });
  }
}
