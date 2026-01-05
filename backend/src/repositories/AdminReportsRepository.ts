import { injectable } from 'inversify';
import { IActivity, IAdminReportsRepository } from '../core/interfaces/repositories/admin/IAdminReportsRepository';
import { Transaction } from '../models/Transaction';
import { Student, IStudent } from '../models/Student';
import { Teacher, ITeacher } from '../models/Teacher';
import { Company } from '../models/Company';
import { Employee } from '../models/Employee';
import { Course, ICourse } from '../models/Course';

@injectable()
export class AdminReportsRepository implements IAdminReportsRepository {

    async getDashboardStats(): Promise<{ totalRevenue: number; totalStudents: number; totalTeachers: number; totalCompanies: number; totalCourses: number; }> {
        const revenueAgg = await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalCourses = await Course.countDocuments({ isPublished: true });

        return { totalRevenue, totalStudents, totalTeachers, totalCompanies, totalCourses };
    }

    async getRecentActivity(limit: number): Promise<IActivity[]> {
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

        const activities: IActivity[] = [];

        recentPurchases.forEach((tx) => {
            activities.push({
                type: 'purchase',
                user: (tx.userId as unknown as IStudent)?.name || 'Someone',
                action: 'enrolled in',
                target: (tx.courseId as unknown as ICourse)?.title || 'a course',
                time: tx.createdAt as Date,
            });
        });

        recentCourses.forEach((course) => {
            activities.push({
                type: 'upload',
                user: (course.teacherId as unknown as ITeacher)?.name || 'A teacher',
                action: 'published',
                target: course.title,
                time: course.createdAt as Date,
            });
        });

        recentStudents.forEach((student) => {
            activities.push({
                type: 'signup',
                user: student.name,
                action: 'joined',
                target: 'as a student',
                time: student.createdAt as Date,
            });
        });

        // Sort by time and limit
        return activities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, limit);
    }

    async getMonthlyRevenue(year: number): Promise<{ _id: number; revenue: number }[]> {
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
                    _id: { $month: '$createdAt' },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
    }

    async getYearlyRevenue(years: number = 5): Promise<{ _id: number; revenue: number }[]> {
        const start = new Date();
        start.setFullYear(start.getFullYear() - years);

        return await Transaction.aggregate([
            {
                $match: {
                    paymentStatus: 'SUCCESS',
                    createdAt: { $gte: start }
                }
            },
            {
                $group: {
                    _id: { $year: '$createdAt' },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
    }

    async getUserDistribution(): Promise<{ name: string; value: number }[]> {
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

    async getTopCourses(limit: number): Promise<{ _id: string; title: string; sales: number; revenue: number }[]> {
        return await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS', courseId: { $exists: true } } },
            { $group: { _id: '$courseId', sales: { $sum: 1 }, revenue: { $sum: '$amount' } } },
            { $sort: { sales: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            { $unwind: '$course' },
            {
                $project: {
                    _id: { $toString: '$_id' },
                    title: '$course.title',
                    sales: 1,
                    revenue: 1
                }
            }
        ]);
    }

    async getCompanyRevenue(): Promise<{ name: string; revenue: number }[]> {
        return await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS', companyId: { $exists: true } } },
            { $group: { _id: '$companyId', totalRevenue: { $sum: '$amount' } } },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'companies',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            { $unwind: '$company' },
            {
                $project: {
                    name: '$company.name',
                    revenue: '$totalRevenue'
                }
            }
        ]);
    }

    async getMostActiveTeachers(limit: number): Promise<{ name: string; email: string; revenue: number; transactions: number }[]> {
        return await Transaction.aggregate([
            { $match: { paymentStatus: 'SUCCESS', teacherId: { $exists: true } } },
            { $group: { _id: '$teacherId', totalRevenue: { $sum: '$amount' }, transactions: { $sum: 1 } } },
            { $sort: { transactions: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'teachers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'teacher'
                }
            },
            { $unwind: '$teacher' },
            {
                $project: {
                    name: '$teacher.name',
                    email: '$teacher.email',
                    revenue: '$totalRevenue',
                    transactions: '$transactions'
                }
            }
        ]);
    }

    async getDailyTrend(days: number): Promise<{ _id: string; sales: number; revenue: number }[]> {
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
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    sales: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);
    }
}
