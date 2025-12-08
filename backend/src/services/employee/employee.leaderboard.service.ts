import { injectable } from "inversify";
import { IEmployeeLeaderboardService, ILeaderboardResponseDTO, ILeaderboardUserDTO } from "../../core/interfaces/services/employee/IEmployeeLeaderboardService";
import { Employee } from "../../models/Employee";
import { EmployeeLearningRecord } from "../../models/EmployeeLearningRecord";
import dayjs from "dayjs";
import mongoose from "mongoose";

@injectable()
export class EmployeeLeaderboardService implements IEmployeeLeaderboardService {

  private format(data: any[], employeeId: string): ILeaderboardResponseDTO {
    const leaderboard: ILeaderboardUserDTO[] = data.map((item) => ({
      _id: item._id.toString(),
      name: item.name,
      hours: Math.round((item.totalMinutes || 0) ),
      streak: item.streakCount || 0,
      courses: item.completedCourses || 0,
      isYou: item._id.toString() === employeeId,
    }));

    leaderboard.sort((a, b) => b.hours - a.hours);

    const youIndex = leaderboard.findIndex((u) => u._id === employeeId);
    const you = youIndex !== -1 ? { ...leaderboard[youIndex], rank: youIndex + 1 } : undefined;

    return { leaderboard, you };
  }

  async getAllTimeLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO> {
    const users = await Employee.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId) } },
      {
        $addFields: {
          completedCourses: {
            $size: {
              $filter: {
                input: "$coursesProgress",
                as: "c",
                cond: { $eq: ["$$c.percentage", 100] }
              }
            }
          }
        }
      },
      {
        $lookup: {
          from: "employeelearningrecords",
          localField: "_id",
          foreignField: "employeeId",
          as: "records"
        }
      },
      { $addFields: { totalMinutes: { $sum: "$records.totalMinutes" } } }
    ]);

    return this.format(users, employeeId);
  }

  async getWeeklyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO> {
    const startOfWeek = dayjs().startOf("week").toDate();

    const data = await EmployeeLearningRecord.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), date: { $gte: startOfWeek } } },
      { $group: { _id: "$employeeId", totalMinutes: { $sum: "$totalMinutes" } } },
      { $lookup: { from: "employees", localField: "_id", foreignField: "_id", as: "emp" } },
      { $unwind: "$emp" },
      {
        $addFields: {
          name: "$emp.name",
          streakCount: "$emp.streakCount",
          completedCourses: {
            $size: {
              $filter: {
                input: "$emp.coursesProgress",
                as: "c",
                cond: { $eq: ["$$c.percentage", 100] }
              }
            }
          }
        }
      }
    ]);

    return this.format(data, employeeId);
  }

  async getMonthlyLeaderboard(employeeId: string, companyId: string): Promise<ILeaderboardResponseDTO> {
    const startOfMonth = dayjs().startOf("month").toDate();

    const data = await EmployeeLearningRecord.aggregate([
      { $match: { companyId: new mongoose.Types.ObjectId(companyId), date: { $gte: startOfMonth } } },
      { $group: { _id: "$employeeId", totalMinutes: { $sum: "$totalMinutes" } } },
      { $lookup: { from: "employees", localField: "_id", foreignField: "_id", as: "emp" } },
      { $unwind: "$emp" },
      {
        $addFields: {
          name: "$emp.name",
          streakCount: "$emp.streakCount",
          completedCourses: {
            $size: {
              $filter: {
                input: "$emp.coursesProgress",
                as: "c",
                cond: { $eq: ["$$c.percentage", 100] }
              }
            }
          }
        }
      }
    ]);

    return this.format(data, employeeId);
  }
}
