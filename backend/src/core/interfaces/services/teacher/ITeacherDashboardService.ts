// Imports removed as they are not needed for the interface definitions


export interface IDashboardStats {
    activeStudents: number;
    totalCourses: number;
    activeCompanies: number; // For now, maybe just companies that bought courses
    totalEarnings: number;
    monthlyEarnings: number;
}

export interface ICoursePerformance {
    courseId: string;
    title: string;
    studentsCount: number;
    earnings: number;
}

export interface IEarningsData {
    month: string;
    year: number;
    amount: number;
}

export interface IScheduleItem {
    id: string;
    day: string;
    date: string; // ISO date
    timeRange: string;
    title: string; // Course name or "Office Hours"
    type: 'class' | 'meeting';
}

export interface ITeacherDashboardService {
    getDashboardStats(teacherId: string): Promise<IDashboardStats>;
    getTopCourses(teacherId: string): Promise<ICoursePerformance[]>;
    getEarningsGraph(teacherId: string, timeframe: string): Promise<IEarningsData[]>;
    getUpcomingSchedule(teacherId: string): Promise<IScheduleItem[]>;
}
