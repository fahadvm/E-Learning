export interface ICourseAnalytics {
    totalEnrollments: number;
    totalRevenue: number;
    averageRating: number;
    ratingDistribution: {
        rating: number;
        count: number;
    }[];
    monthlyEnrollments: {
        month: string;
        enrollments: number;
    }[];
}
