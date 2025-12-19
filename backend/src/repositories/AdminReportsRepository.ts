
import { injectable } from "inversify";
import { IAdminReportsRepository } from "../core/interfaces/repositories/admin/IAdminReportsRepository";
import mongoose from "mongoose";
import { Transaction } from "../models/Transaction";
import { Student } from "../models/Student";
import { Teacher } from "../models/Teacher";
import { Company } from "../models/Company";
import { Employee } from "../models/Employee";
import { Course } from "../models/Course";

@injectable()
export class AdminReportsRepository implements IAdminReportsRepository {

    async getDashboardStats(): Promise<{ totalRevenue: number; totalStudents: number; totalTeachers: number; totalCompanies: number; totalCourses: number; }> {
        const revenueAgg = await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS' } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalCourses = await Course.countDocuments({ isPublished: true });

        return { totalRevenue, totalStudents, totalTeachers, totalCompanies, totalCourses };
    }

    async getRecentActivity(limit: number): Promise<any[]> {
        // Fetch recent purchases
        const recentPurchases = await Transaction.find({ type: 'COURSE_PURCHASE', paymentStatus: 'SUCCESS' })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name')
            .populate('courseId', 'title')
            .lean();

        // Fetch recent course uploads
        const recentCourses = await Course.find({ isPublished: true })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('teacherId', 'name')
            .lean();

        // Fetch recent student signups
        const recentStudents = await Student.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        const activities: any[] = [];

        recentPurchases.forEach((tx: any) => {
            activities.push({
                type: 'purchase',
                user: tx.userId?.name || 'Someone',
                action: 'enrolled in',
                target: tx.courseId?.title || 'a course',
                time: tx.createdAt,
            });
        });

        recentCourses.forEach((course: any) => {
            activities.push({
                type: 'upload',
                user: course.teacherId?.name || 'A teacher',
                action: 'published',
                target: course.title,
                time: course.createdAt,
            });
        });

        recentStudents.forEach((student: any) => {
            activities.push({
                type: 'signup',
                user: student.name,
                action: 'joined',
                target: 'as a student',
                time: student.createdAt,
            });
        });

        // Sort by time and limit
        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, limit);
    }

    async getMonthlyRevenue(year: number): Promise<any[]> {
        const start = new Date(year, 0, 1);
        const end = new Date(year + 1, 0, 1);

        return await Transaction.aggregate([
            {
                $match: {
                    paymentStatus: 'SUCCESS',
                    createdAt: { $gte: start, $lt: end }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
    }

    async getUserDistribution(): Promise<any[]> {
        const students = await Student.countDocuments();
        const teachers = await Teacher.countDocuments();
        const companies = await Company.countDocuments();
        const employees = await Employee.countDocuments();

        return [
            { name: 'Students', value: students },
            { name: 'Teachers', value: teachers },
            { name: 'Companies', value: companies },
            { name: 'Employees', value: employees },
        ];
    }

    async getTopCourses(limit: number): Promise<any[]> {
        // Assuming courses have purchasedCount or we count from transactions
        // Better to count from transactions for accuracy over time if purchasedCount isn't reliable
        // But let's check Transaction model structure for courseId.
        return await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS', courseId: { $exists: true } } },
            { $group: { _id: "$courseId", sales: { $sum: 1 }, revenue: { $sum: "$amount" } } },
            { $sort: { sales: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "course"
                }
            },
            { $unwind: "$course" },
            {
                $project: {
                    _id: 1,
                    title: "$course.title",
                    sales: 1,
                    revenue: 1
                }
            }
        ]);
    }

    async getCompanyRevenue(): Promise<any[]> {
        return await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS', companyId: { $exists: true } } },
            { $group: { _id: "$companyId", totalRevenue: { $sum: "$amount" } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "companies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "company"
                }
            },
            { $unwind: "$company" },
            {
                $project: {
                    name: "$company.name",
                    revenue: "$totalRevenue"
                }
            }
        ]);
    }

    async getMostActiveTeachers(limit: number): Promise<any[]> {
        // "Active" could mean login, or content creation, or sales.
        // Let's assume sales/transactions for now as it's a "Reports" page often linked to revenue.
        // Or number of courses? 
        // Let's go with Revenue generated by teacher.
        return await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS', teacherId: { $exists: true } } },
            { $group: { _id: "$teacherId", totalRevenue: { $sum: "$amount" }, transactions: { $sum: 1 } } },
            { $sort: { transactions: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "teachers",
                    localField: "_id",
                    foreignField: "_id",
                    as: "teacher"
                }
            },
            { $unwind: "$teacher" },
            {
                $project: {
                    name: "$teacher.name",
                    email: "$teacher.email",
                    revenue: "$totalRevenue",
                    transactions: "$transactions"
                }
            }
        ]);
    }

    async getDailyTrend(days: number): Promise<any[]> {
        const start = new Date();
        start.setDate(start.getDate() - days);

        return await Transaction.aggregate([
            {
                $match: {
                    paymentStatus: 'SUCCESS',
                    createdAt: { $gte: start }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    sales: { $sum: 1 },
                    revenue: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
    }
}
