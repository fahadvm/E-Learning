export interface IActivity {
    type: string;
    user: string;
    action: string;
    target: string;
    time: Date;
}

export interface IAdminReportsRepository {
    getDashboardStats(): Promise<{
        totalRevenue: number;
        totalStudents: number;
        totalTeachers: number;
        totalCompanies: number;
        totalCourses: number;
    }>;
    getMonthlyRevenue(year: number): Promise<{ _id: number; revenue: number }[]>;
    getUserDistribution(): Promise<{ name: string; value: number }[]>;
    getTopCourses(limit: number): Promise<{ _id: string; title: string; sales: number; revenue: number }[]>;
    getCompanyRevenue(): Promise<{ name: string; revenue: number }[]>;
    getMostActiveTeachers(limit: number): Promise<{ name: string; email: string; revenue: number; transactions: number }[]>;
    getDailyTrend(days: number): Promise<{ _id: string; sales: number; revenue: number }[]>;
    getRecentActivity(limit: number): Promise<IActivity[]>;
}
