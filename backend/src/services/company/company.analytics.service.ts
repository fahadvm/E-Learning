import { inject, injectable } from 'inversify';
import { TYPES } from '../../core/di/types';
import { ICompanyRepository } from '../../core/interfaces/repositories/ICompanyRepository';
import { Employee } from '../../models/Employee';
import { EmployeeLearningPathProgress } from '../../models/EmployeeLearningPathProgress';
import { EmployeeLearningRecord } from '../../models/EmployeeLearningRecord';
import { CompanyOrderModel } from '../../models/CompanyOrder';
import mongoose from 'mongoose';

interface TrackerStats {
    totalEmployees: number;
    totalLearningHours: number;
    avgCompletionRate: number;
    totalCourses: number;
    graph: Array<{ label: string; hours: number }>;
    mostActive: Array<{ id: string; name: string; hours: number; progress: number }>;
    leastActive: Array<{ id: string; name: string; hours: number; progress: number }>;
}

@injectable()
export class CompanyAnalyticsService {
    constructor(
        @inject(TYPES.CompanyRepository) private readonly _companyRepo: ICompanyRepository
    ) { }

    async getTrackerStats(companyId: string, range: 'week' | 'month' | 'year'): Promise<TrackerStats> {
        const now = new Date();
        const startDate = this.getStartDate(now, range);

        // 1. Total Employees
        const totalEmployees = await Employee.countDocuments({ companyId: new mongoose.Types.ObjectId(companyId) });

        // 2. Total Learning Hours (from learning records - convert minutes to hours)
        const learningRecords = await EmployeeLearningRecord.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            {
                $match: {
                    'employee.companyId': new mongoose.Types.ObjectId(companyId),
                    date: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalMinutes: { $sum: '$totalMinutes' }
                }
            }
        ]);

        const totalLearningHours = learningRecords[0]?.totalMinutes ? learningRecords[0].totalMinutes / 60 : 0;

        // 3. Average Completion Rate
        const progressRecords = await EmployeeLearningPathProgress.find({
            companyId: new mongoose.Types.ObjectId(companyId)
        });

        const avgCompletionRate = progressRecords.length > 0
            ? progressRecords.reduce((sum, p) => sum + (p.percentage || 0), 0) / progressRecords.length
            : 0;

        // 4. Total Courses
        const orders = await CompanyOrderModel.find({
            companyId: new mongoose.Types.ObjectId(companyId),
            status: 'paid'
        });

        const uniqueCourses = new Set();
        orders.forEach(order => {
            order.purchasedCourses.forEach(pc => {
                uniqueCourses.add(pc.courseId.toString());
            });
        });
        const totalCourses = uniqueCourses.size;

        // 5. Graph Data
        const graph = await this.getGraphData(companyId, range, startDate, now);

        // 6. Most Active & Least Active Employees
        const employeeStats = await this.getEmployeeStats(companyId, startDate);
        const mostActive = employeeStats.slice(0, 10);
        const leastActive = employeeStats.slice(-10).reverse();

        return {
            totalEmployees,
            totalLearningHours: Math.round(totalLearningHours * 10) / 10,
            avgCompletionRate: Math.round(avgCompletionRate * 10) / 10,
            totalCourses,
            graph,
            mostActive,
            leastActive
        };
    }

    private getStartDate(now: Date, range: 'week' | 'month' | 'year'): Date {
        const date = new Date(now);

        if (range === 'week') {
            date.setDate(date.getDate() - 7);
        } else if (range === 'month') {
            date.setMonth(date.getMonth() - 1);
        } else if (range === 'year') {
            date.setFullYear(date.getFullYear() - 1);
        }

        return date;
    }

    private async getGraphData(
        companyId: string,
        range: 'week' | 'month' | 'year',
        startDate: Date,
        endDate: Date
    ): Promise<Array<{ label: string; hours: number }>> {
        const records = await EmployeeLearningRecord.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'employeeId',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            {
                $match: {
                    'employee.companyId': new mongoose.Types.ObjectId(companyId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: '$date',
                    minutes: { $sum: '$totalMinutes' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        if (range === 'week') {
            return this.groupByDays(records, startDate);
        } else if (range === 'month') {
            return this.groupByWeeks(records, startDate);
        } else {
            return this.groupByMonths(records, startDate);
        }
    }

    private groupByDays(records: any[], startDate: Date): Array<{ label: string; hours: number }> {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const result = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            const dayName = days[date.getDay()];

            const dayRecords = records.filter(r => {
                const recordDate = new Date(r._id);
                return recordDate.toDateString() === date.toDateString();
            });

            const minutes = dayRecords.reduce((sum, r) => sum + r.minutes, 0);
            const hours = minutes / 60;
            result.push({ label: dayName, hours: Math.round(hours * 10) / 10 });
        }

        return result;
    }

    private groupByWeeks(records: any[], startDate: Date): Array<{ label: string; hours: number }> {
        const result = [];

        for (let week = 1; week <= 4; week++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(weekStart.getDate() + (week - 1) * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const weekRecords = records.filter(r => {
                const recordDate = new Date(r._id);
                return recordDate >= weekStart && recordDate <= weekEnd;
            });

            const minutes = weekRecords.reduce((sum, r) => sum + r.minutes, 0);
            const hours = minutes / 60;
            result.push({ label: `Week ${week}`, hours: Math.round(hours * 10) / 10 });
        }

        return result;
    }

    private groupByMonths(records: any[], startDate: Date): Array<{ label: string; hours: number }> {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const result = [];

        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(startDate);
            monthDate.setMonth(monthDate.getMonth() + i);
            const monthName = months[monthDate.getMonth()];

            const monthRecords = records.filter(r => {
                const recordDate = new Date(r._id);
                return recordDate.getMonth() === monthDate.getMonth() &&
                    recordDate.getFullYear() === monthDate.getFullYear();
            });

            const minutes = monthRecords.reduce((sum, r) => sum + r.minutes, 0);
            const hours = minutes / 60;
            result.push({ label: monthName, hours: Math.round(hours * 10) / 10 });
        }

        return result;
    }

    private async getEmployeeStats(
        companyId: string,
        startDate: Date
    ): Promise<Array<{ id: string; name: string; hours: number; progress: number }>> {
        const employees = await Employee.find({ companyId: new mongoose.Types.ObjectId(companyId) })
            .select('_id name email')
            .lean();

        const stats = await Promise.all(
            employees.map(async (emp) => {
                // Get total hours (convert minutes to hours)
                const records = await EmployeeLearningRecord.find({
                    employeeId: emp._id,
                    date: { $gte: startDate }
                });

                const totalMinutes = records.reduce((sum, r) => sum + (r.totalMinutes || 0), 0);
                const totalHours = totalMinutes / 60;

                // Get progress
                const progress = await EmployeeLearningPathProgress.find({
                    employeeId: emp._id
                });

                const avgProgress = progress.length > 0
                    ? progress.reduce((sum, p) => sum + (p.percentage || 0), 0) / progress.length
                    : 0;

                return {
                    id: emp._id.toString(),
                    name: emp.name || emp.email,
                    hours: Math.round(totalHours * 10) / 10,
                    progress: Math.round(avgProgress)
                };
            })
        );

        // Sort by hours (descending)
        return stats.sort((a, b) => b.hours - a.hours);
    }
}
