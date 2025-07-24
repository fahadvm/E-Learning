import { injectable } from "inversify";
import { IStudentRepository } from "../../core/interfaces/repositories/student/IStudentRepository";
import { Student, IStudent } from "../../models/Student";
import { FilterQuery } from "mongoose";

@injectable()
export class StudentRepository implements IStudentRepository {

  async create(student: Partial<IStudent>): Promise<IStudent> {
    return await Student.create(student);
  }

  async findByEmail(email: string): Promise<IStudent | null> {
    return await Student.findOne({ email });
  }

  async findAll(): Promise<IStudent[]> {
    return await Student.find();
  }

  async findOne(filter: FilterQuery<IStudent>): Promise<IStudent | null> {
    return await Student.findOne(filter);
  }

  async findById(id: string): Promise<IStudent | null> {
    return await Student.findById(id);
  }

  async update(id: string, data: Partial<IStudent>): Promise<IStudent> {
    const updated = await Student.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!updated) {
      throw new Error("Student not found for update.");
    }
    return updated;
  }

  async updateByEmail(email: string, updateData: Partial<IStudent>): Promise<IStudent | null> {
    return await Student.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true }
    );
  }
}
