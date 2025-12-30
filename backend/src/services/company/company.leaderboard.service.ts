import { injectable } from "inversify";
import mongoose from "mongoose";
import { Employee } from "../../models/Employee";
import { EmployeeLearningRecord } from "../../models/EmployeeLearningRecord";
import { redis } from "../../utils/redisClient";
import { ICompanyLeaderboardService, ICompanyLeaderboardUserDTO } from "../../core/interfaces/services/company/ICompanyLeaderboardService";

@injectable()
export class CompanyLeaderboardService implements ICompanyLeaderboardService {

  // Get Top 50 Employees (Ranked from Redis)
  async getTop50(companyId: string) {
    const key = `leaderboard:${companyId}`;

    const entries = await redis.zrevrange(key, 0, 49, "WITHSCORES");

    const ranked: { employeeId: string; score: number }[] = [];
    for (let i = 0; i < entries.length; i += 2) {
      ranked.push({ employeeId: entries[i], score: Number(entries[i + 1]) });
    }

    const employeeIds = ranked.map((x) => new mongoose.Types.ObjectId(x.employeeId));

    const employees = await Employee.find({ _id: { $in: employeeIds } })
      .select("_id name profilePicture coursesProgress streakCount companyId")
      .lean();

    // Compute course count & total learning minutes
    const learningRecords = await EmployeeLearningRecord.aggregate([
      { $match: { employeeId: { $in: employeeIds } } },
      { $group: { _id: "$employeeId", totalMinutes: { $sum: "$totalMinutes" } } }
    ]);

    const result: ICompanyLeaderboardUserDTO[] = [];
    let currentRank = 1;

    for (const item of ranked) {
      const emp = employees.find(e => e._id.toString() === item.employeeId);

      // Safety check: if employee no longer exists or belongs to another company, skip and clean Redis
      if (!emp || emp.companyId?.toString() !== companyId) {
        await redis.zrem(key, item.employeeId);
        continue;
      }

      const learning = learningRecords.find(l => l._id.toString() === item.employeeId);

      result.push({
        _id: item.employeeId,
        name: emp.name,
        avatar: emp.profilePicture ?? null,
        hours: Math.round(learning?.totalMinutes || 0),
        courses: emp.coursesProgress?.filter(c => c.percentage === 100).length || 0,
        streak: emp.streakCount || 0,
        rank: currentRank++
      });
    }

    return result;
  }

  // Search ANY employee rank (even if not in Top 50)
  async searchEmployee(companyId: string, name: string): Promise<ICompanyLeaderboardUserDTO | null> {
    const employee = await Employee.findOne({
      companyId,
      name: { $regex: name, $options: "i" }
    }).lean();

    if (!employee) return null;

    // Compute completed courses
    const completedCourses = employee.coursesProgress?.filter(c => c.percentage === 100).length || 0;

    // Get total learning minutes from records
    const learning = await EmployeeLearningRecord.aggregate([
      { $match: { employeeId: employee._id, companyId: new mongoose.Types.ObjectId(companyId) } },
      { $group: { _id: "$employeeId", totalMinutes: { $sum: "$totalMinutes" } } }
    ]);

    const totalMinutes = learning.length > 0 ? learning[0].totalMinutes : 0;

    // Score formula
    const score = (totalMinutes * 10) + (completedCourses * 50) + (employee.streakCount * 2);

    const key = `leaderboard:${companyId}`;
    await redis.zadd(key, score, employee._id.toString());

    const rankIndex = await redis.zrevrank(key, employee._id.toString());
    const rank = rankIndex !== null ? rankIndex + 1 : null;

    return {
      _id: employee._id.toString(),
      name: employee.name,
      avatar: employee.profilePicture ?? null,
      hours: Math.round(totalMinutes),
      courses: completedCourses,
      streak: employee.streakCount,
      rank
    };
  }
}
