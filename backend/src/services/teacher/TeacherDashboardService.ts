import { inject, injectable } from "inversify";
import { ITeacherDashboardService, IDashboardStats, ICoursePerformance, IEarningsData, IScheduleItem } from "../../core/interfaces/services/teacher/ITeacherDashboardService";
import { TYPES } from "../../core/di/types";
import { ICourseRepository } from "../../core/interfaces/repositories/ICourseRepository";
import { IWalletRepository } from "../../core/interfaces/repositories/IwalletRepository";
import mongoose from "mongoose";
// Direct model access for aggregations
import { Booking } from "../../models/Booking";
import { Transaction } from "../../models/Transaction";
import { OrderModel } from "../../models/Order";
import { CompanyOrderModel } from "../../models/CompanyOrder";
@injectable()
export class TeacherDashboardService implements ITeacherDashboardService {
    constructor(
        @inject(TYPES.CourseRepository) private readonly _courseRepository: ICourseRepository,
        @inject(TYPES.WalletRepository) private readonly _walletRepo: IWalletRepository
    ) { }

    async getDashboardStats(teacherId: string): Promise<IDashboardStats> {
        const tId = new mongoose.Types.ObjectId(teacherId);

        // 1. Total Courses
        const courses = await this._courseRepository.findByTeacherId(teacherId);
        const totalCourses = courses.length;

        // 2. Active Students (Unique students who bought courses)
        const studentStats = await OrderModel.aggregate([
            { $match: { status: "paid" } },
            { $unwind: "$courses" },
            {
                $lookup: {
                    from: "courses",
                    localField: "courses",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            { $unwind: "$courseDetails" },
            { $match: { "courseDetails.teacherId": tId } },
            { $group: { _id: null, uniqueStudents: { $addToSet: "$studentId" } } }
        ]);
        const activeStudents = studentStats.length > 0 ? studentStats[0].uniqueStudents.length : 0;

        // 3. Active Companies
        const companyStats = await CompanyOrderModel.aggregate([
            { $match: { status: "paid" } },
            { $unwind: "$purchasedCourses" },
            {
                $lookup: {
                    from: "courses",
                    localField: "purchasedCourses.courseId",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            { $unwind: "$courseDetails" },
            { $match: { "courseDetails.teacherId": tId } },
            { $group: { _id: null, uniqueCompanies: { $addToSet: "$companyId" } } }
        ]);
        const activeCompanies = companyStats.length > 0 ? companyStats[0].uniqueCompanies.length : 0;

        // 4. Earnings
        const wallet = await this._walletRepo.findByTeacherId(teacherId);
        const totalEarnings = wallet ? wallet.totalEarned : 0;

        // Monthly Earnings (Current Month)
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyStats = await Transaction.aggregate([
            {
                $match: {
                    teacherId: tId,
                    type: "TEACHER_EARNING",
                    createdAt: { $gte: startOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const monthlyEarnings = monthlyStats.length > 0 ? monthlyStats[0].total : 0;

        return {
            activeStudents,
            totalCourses,
            activeCompanies,
            totalEarnings,
            monthlyEarnings
        };
    }

    async getTopCourses(teacherId: string): Promise<ICoursePerformance[]> {
        const tId = new mongoose.Types.ObjectId(teacherId);

        // Aggregate from Transactions to get earnings per course
        // Or aggregate from Orders. 
        // Using Transactions is better for "Earnings" per course if we record courseId in transaction.
        // The Transaction model has `courseId`.

        const topCourses = await Transaction.aggregate([
            {
                $match: {
                    teacherId: tId,
                    type: "TEACHER_EARNING",
                    courseId: { $exists: true }
                }
            },
            {
                $group: {
                    _id: "$courseId",
                    earnings: { $sum: "$amount" }
                }
            },
            { $sort: { earnings: -1 } },
            { $limit: 3 },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: "$course" },
            // Count students for this course
            {
                $lookup: {
                    from: "orders",
                    let: { cId: "$_id" },
                    pipeline: [
                        { $match: { status: "paid" } },
                        { $unwind: "$courses" },
                        { $match: { $expr: { $eq: ["$courses", "$$cId"] } } }
                    ],
                    as: "orders"
                }
            },
            {
                $project: {
                    courseId: "$_id",
                    title: "$course.title",
                    earnings: 1,
                    studentsCount: { $size: "$orders" }
                }
            }
        ]);

        return topCourses;
    }

    async getEarningsGraph(teacherId: string, timeframe: string): Promise<IEarningsData[]> {
        const tId = new mongoose.Types.ObjectId(teacherId);

        // Last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of that month

        const earnings = await Transaction.aggregate([
            {
                $match: {
                    teacherId: tId,
                    type: "TEACHER_EARNING",
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return earnings.map(e => ({
            month: months[e._id.month - 1],
            year: e._id.year,
            amount: e.amount
        }));
    }

    async getUpcomingSchedule(teacherId: string): Promise<IScheduleItem[]> {
        const bookings = await Booking.find({
            teacherId: teacherId,
            status: "booked", // or pending/booked
            date: { $gte: new Date().toISOString().split('T')[0] } // From today
        })
            .sort({ date: 1, "slot.start": 1 })
            .limit(4)
            .populate("courseId", "title");

        return bookings.map(b => ({
            id: b._id.toString(),
            day: b.day,
            date: b.date,
            timeRange: `${b.slot.start} - ${b.slot.end}`,
            title: (b.courseId as any)?.title || "Mentorship Session",
            type: 'class'
        }));
    }
}
