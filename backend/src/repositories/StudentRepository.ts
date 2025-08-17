// repositories/student/StudentRepository.ts
import { injectable } from 'inversify';
import { FilterQuery } from 'mongoose';
import { IStudentRepository } from '../core/interfaces/repositories/student/IStudentRepository';
import { Student, IStudent } from '../models/Student';

@injectable()
export class StudentRepository implements IStudentRepository {

  async create(student: Partial<IStudent>): Promise<IStudent> {
    return Student.create(student);
  }

  async findByEmail(email: string): Promise<IStudent | null> {
    return Student.findOne({ email }).lean().exec();
  }

  async findAll(skip: number, limit: number, search?: string): Promise<IStudent[]> {
    const filter: FilterQuery<IStudent> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};

    return Student.find(filter)
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async findOne(filter: FilterQuery<IStudent>): Promise<IStudent | null> {
    return Student.findOne(filter).lean().exec();
  }

  async findById(id: string): Promise<IStudent | null> {
    return Student.findById(id).lean().exec();
  }

  async update(id: string, data: Partial<IStudent>): Promise<IStudent> {
    const updated = await Student.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean().exec();

    if (!updated) {
      throw new Error('Student not found for update.');
    }
    return updated;
  }

  async updateByEmail(email: string, updateData: Partial<IStudent>): Promise<IStudent | null> {
    return Student.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    ).lean().exec();
  }

  async updateProfile(studentId: string, profileData: Partial<IStudent>): Promise<IStudent | null> {
    return Student.findByIdAndUpdate(studentId, profileData, { new: true }).lean().exec();
  }

  async count(search?: string): Promise<number> {
    const filter: FilterQuery<IStudent> = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
    return Student.countDocuments(filter).exec();
  }
}
