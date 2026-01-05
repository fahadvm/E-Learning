import { IActivity } from '../../repositories/admin/IAdminReportsRepository';

export interface IDashboardData {
    stats: {
        totalRevenue: number;
        totalStudents: number;
        totalTeachers: number;
        totalCompanies: number;
        totalCourses: number;
    };
    monthlyRevenue: { _id: number; revenue: number }[];
    yearlyRevenue: { _id: number; revenue: number }[];
    userDistribution: { name: string; value: number }[];
    topCourses: { _id: string; title: string; sales: number; revenue: number }[];
    companyRevenue: { name: string; revenue: number }[];
    activeTeachers: { name: string; email: string; revenue: number; transactions: number }[];
    dailyTrend: { _id: string; sales: number; revenue: number }[];
    recentActivity: IActivity[];
}

export interface IAdminReportsService {
    getDashboardStats(): Promise<IDashboardData>;
    exportReport(format: string): Promise<void>; // Placeholder for binary data or file path
}
