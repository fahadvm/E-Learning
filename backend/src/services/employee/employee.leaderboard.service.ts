import { injectable } from 'inversify';
import { IEmployeeLeaderboardService, ILeaderboardResponseDTO, ILeaderboardUserDTO } from '../../core/interfaces/services/employee/IEmployeeLeaderboardService';
import { Employee } from '../../models/Employee';
import { EmployeeLearningRecord } from '../../models/EmployeeLearningRecord';
import dayjs from 'dayjs';
import mongoose from 'mongoose';

interface ILeaderboardRawData {
  _id: mongoose.Types.ObjectId;
  name: string;
  totalMinutes?: number;
  streakCount?: number;
  completedCourses?: number;
}

@injectable()
export class EmployeeLeaderboardService implements IEmployeeLeaderboardService {

  private format(data: ILeaderboardRawData[], employeeId: string): ILeaderboardResponseDTO {
    const leaderboard: ILeaderboardUserDTO[] = data
      .map((item) => ({
        _id: item._id.toString(),
        name: item.name,
        hours: Math.round((item.totalMinutes || 0)),
        streak: item.streakCount || 0,
        courses: item.completedCourses || 0,
        isYou: item._id.toString() === employeeId,
      }))
      .sort((a, b) => b.hours - a.hours)
      .map((item, index) => ({ ...item, rank: index + 1 } as ILeaderboardUserDTO));

    const you = leaderboard.find((u) => u._id === employeeId);

    return { leaderboard, you };
  }

  async getAllTimeLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO> {
    const users: ILeaderboardRawData[] = await Employee.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      {
        $addFields: {
          completedCourses: {
            $size: {
              $filter: {
                input: '$coursesProgress',
                as: 'c',
                cond: { $eq: ['$$c.percentage', 100] }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: 'employeelearningrecords',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'records'
        }
      },
      { $addFields: { totalMinutes: { $sum: '$records.totalMinutes' } } }
    ]);

    return this.format(users, employeeId);
  }

  async getWeeklyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO> {
    const startOfWeek = dayjs().startOf('week').toDate();

    const data: ILeaderboardRawData[] = await EmployeeLearningRecord.aggregate([
      { $match: { date: { $gte: startOfWeek } } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'emp'
        }
      },
      { $unwind: '$emp' },
      { $match: { 'emp.companyId': new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$employeeId',
          totalMinutes: { $sum: '$totalMinutes' },
          name: { $first: '$emp.name' },
          streakCount: { $first: '$emp.streakCount' },
          coursesProgress: { $first: '$emp.coursesProgress' }
        }
      },
      {
        $addFields: {
          completedCourses: {
            $size: {
              $filter: {
                input: '$coursesProgress',
                as: 'c',
                cond: { $eq: ['$$c.percentage', 100] }
              }
            }
          }
        }
      }
    ]);

    return this.format(data, employeeId);
  }

  async getMonthlyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO> {
    const startOfMonth = dayjs().startOf('month').toDate();

    const data: ILeaderboardRawData[] = await EmployeeLearningRecord.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'emp'
        }
      },
      { $unwind: '$emp' },
      { $match: { 'emp.companyId': new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: '$employeeId',
          totalMinutes: { $sum: '$totalMinutes' },
          name: { $first: '$emp.name' },
          streakCount: { $first: '$emp.streakCount' },
          coursesProgress: { $first: '$emp.coursesProgress' }
        }
      },
      {
        $addFields: {
          completedCourses: {
            $size: {
              $filter: {
                input: '$coursesProgress',
                as: 'c',
                cond: { $eq: ['$$c.percentage', 100] }
              }
            }
          }
        }
      }
    ]);

    return this.format(data, employeeId);
  }
}
