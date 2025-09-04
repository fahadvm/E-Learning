import { injectable } from 'inversify';
import { ITeacherRepository } from '../core/interfaces/repositories/ITeacherRepository';
import { ITeacher, Teacher } from '../models/Teacher';
import { FilterQuery } from 'mongoose';


@injectable()
export class TeacherRepository implements ITeacherRepository {

  async create(teacher: Partial<ITeacher>): Promise<ITeacher> {
    return Teacher.create(teacher);
  }

  async updateById(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async findById(teacherId: string): Promise<ITeacher | null> {
    return Teacher.findById(teacherId).lean();
  }

  async findOne(filter: FilterQuery<ITeacher>): Promise<ITeacher | null> {
  return Teacher.findOne(filter).lean();
}

  async findByEmail(email: string): Promise<ITeacher | null> {
    return Teacher.findOne({ email }).lean();
  }

  async updateByEmail(email: string, updateData: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findOneAndUpdate({ email }, updateData, { new: true }).lean();
  }

  async addProfile(profile: ITeacher): Promise<ITeacher> {
    return Teacher.create(profile);
  }

  async editProfile(id: string, data: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async getProfileByUserId(userId: string): Promise<ITeacher | null> {
    return Teacher.findOne({ userId }).lean();
  }

  async findAll(params?: { skip?: number; limit?: number; search?: string }): Promise<ITeacher[]> {
    const query: any = {};
    if (params?.search) {
      query.$or = [
        { name: { $regex: params.search, $options: 'i' } },
        { email: { $regex: params.search, $options: 'i' } }
      ];
    }
    return Teacher.find(query)
      .skip(params?.skip || 0)
      .limit(params?.limit || 0)
      .lean();
  }

  async count(search?: string): Promise<number> {
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    return Teacher.countDocuments(query);
  }

  async getUnverifiedTeachers(): Promise<ITeacher[]> {
    return Teacher.find({ isVerified: false, isRejected: false }).lean();
  }

  async findUnverified(): Promise<ITeacher[]> {
    return Teacher.find({ isVerified: false }).lean();
  }

  async verifyTeacherById(id: string): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, { isVerified: true, isRejected: false }, { new: true }).lean();
  }

  async rejectTeacherById(id: string): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(id, { isVerified: false, isRejected: true }, { new: true }).lean();
  }

  async updateStatus(teacherId: string, updates: Partial<ITeacher>): Promise<ITeacher | null> {
    return Teacher.findByIdAndUpdate(teacherId, updates, { new: true }).lean();
  }
}
