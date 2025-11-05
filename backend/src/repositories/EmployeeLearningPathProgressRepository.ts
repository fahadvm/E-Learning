import { injectable } from "inversify";
import { Types } from "mongoose";
import { IEmployeeLearningPathProgressRepository } from "../core/interfaces/repositories/IEmployeeLearningPathProgressRepository";
import { EmployeeLearningPathProgress, IEmployeeLearningPathProgress } from "../models/EmployeeLearningPathProgress";

@injectable()
export class EmployeeLearningPathProgressRepository implements IEmployeeLearningPathProgressRepository {
  async findAssigned(companyId: string, employeeId: string): Promise<IEmployeeLearningPathProgress[]> {
    return EmployeeLearningPathProgress.find({
      companyId: new Types.ObjectId(companyId),
      employeeId: new Types.ObjectId(employeeId),
    })
      .populate("learningPathId")
      .lean()
      .exec();
  }

  async findOne(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress | null> {
    return EmployeeLearningPathProgress.findOne({
      companyId: new Types.ObjectId(companyId),
      employeeId: new Types.ObjectId(employeeId),
      learningPathId: new Types.ObjectId(learningPathId),
    })
      .lean()
      .exec();
  }

  async create(companyId: string, employeeId: string, learningPathId: string): Promise<IEmployeeLearningPathProgress> {
    const doc = await EmployeeLearningPathProgress.create({
      companyId: new Types.ObjectId(companyId),
      employeeId: new Types.ObjectId(employeeId),
      learningPathId: new Types.ObjectId(learningPathId),
      status: "active",
      currentCourseIndex: 0,
      completedCourseIds: [],
    });
    return doc.toObject() as IEmployeeLearningPathProgress;
  }

  async delete(companyId: string, employeeId: string, learningPathId: string): Promise<void> {
    await EmployeeLearningPathProgress.findOneAndDelete({
      companyId: new Types.ObjectId(companyId),
      employeeId: new Types.ObjectId(employeeId),
      learningPathId: new Types.ObjectId(learningPathId),
    }).exec();
  }
}
