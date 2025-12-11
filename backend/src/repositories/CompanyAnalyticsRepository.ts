import { injectable } from 'inversify';
import mongoose from 'mongoose';
import {
  ICompanyAnalyticsRepository,
  ILearningRecord,
  IEmployeeBasic,
  IEmployeeProgress,
  ILearningRecordRaw,
  ICompanyOrder
} from '../core/interfaces/repositories/ICompanyAnalyticsRepository';
import { Employee } from '../models/Employee';
import { EmployeeLearningRecord } from '../models/EmployeeLearningRecord';
import { EmployeeLearningPathProgress } from '../models/EmployeeLearningPathProgress';
import { CompanyOrderModel } from '../models/CompanyOrder';
@injectable()
export class CompanyAnalyticsRepository implements ICompanyAnalyticsRepository {
  
  async countEmployees(companyId: string): Promise<number> {
    return Employee.countDocuments({ companyId: new mongoose.Types.ObjectId(companyId) });
  }

  async getLearningRecords(
    companyId: string,
    startDate: Date,
    endDate?: Date
  ): Promise<ILearningRecord[]> {
    const match: Record<string, unknown> = {
      'employee.companyId': new mongoose.Types.ObjectId(companyId),
      date: { $gte: startDate }
    };

    if (endDate) {
      (match.date as Record<string, Date>).$lte = endDate;
    }

    return EmployeeLearningRecord.aggregate<ILearningRecord>([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      { $unwind: '$employee' },
      { $match: match },
      {
        $group: {
          _id: '$date',
          minutes: { $sum: '$totalMinutes' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }

  async getProgressRecords(companyId: string): Promise<IEmployeeProgress[]> {
    return EmployeeLearningPathProgress.find({
      companyId: new mongoose.Types.ObjectId(companyId)
    }).lean<IEmployeeProgress[]>();
  }

  async getPaidOrders(companyId: string): Promise<ICompanyOrder[]> {
    return CompanyOrderModel.find({
      companyId: new mongoose.Types.ObjectId(companyId),
      status: 'paid'
    }).lean<ICompanyOrder[]>();
  }

  async getEmployees(companyId: string): Promise<IEmployeeBasic[]> {
    return Employee.find({
      companyId: new mongoose.Types.ObjectId(companyId)
    })
      .select('_id name email')
      .lean<IEmployeeBasic[]>();
  }

  async getEmployeeLearningRecords(
    employeeId: string,
    startDate: Date
  ): Promise<ILearningRecordRaw[]> {
    return EmployeeLearningRecord.find({
      employeeId,
      date: { $gte: startDate }
    }).lean<ILearningRecordRaw[]>();
  }

  async getEmployeeProgress(employeeId: string): Promise<IEmployeeProgress[]> {
    return EmployeeLearningPathProgress.find({ employeeId }).lean<IEmployeeProgress[]>();
  }
}
