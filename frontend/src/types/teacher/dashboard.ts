export interface IDashboardStats {
    activeStudents: number;
    totalCourses: number;
    activeCompanies: number;
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
    date: string;
    timeRange: string;
    title: string;
    type: 'class' | 'meeting';
}
