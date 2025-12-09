
export interface IAdminReportsRepository {
    getDashboardStats(): Promise<{
        totalRevenue: number;
        totalStudents: number;
        totalTeachers: number;
        totalCompanies: number;
    }>;
    getMonthlyRevenue(year: number): Promise<any[]>;
    getUserDistribution(): Promise<any[]>;
    getTopCourses(limit: number): Promise<any[]>;
    getCompanyRevenue(): Promise<any[]>;
    getMostActiveTeachers(limit: number): Promise<any[]>;
    getDailyTrend(days: number): Promise<any[]>;
}
