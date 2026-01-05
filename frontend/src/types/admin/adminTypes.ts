// Transaction Types
export interface Transaction {
    _id: string;
    type: 'course_purchase' | 'subscription' | 'refund' | 'payout';
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    userId?: string;
    courseId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface TransactionQuery {
    page: number;
    limit: number;
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

// Subscription Plan Types
export interface SubscriptionFeature {
    name: string;
    enabled: boolean;
}

export interface SubscriptionPlan {
    _id?: string;
    name: string;
    price: number;
    duration: number;
    features: SubscriptionFeature[];
    isActive: boolean;
    description?: string;
}

export interface SubscriptionFormData {
    name: string;
    price: string;
    duration: string;
    features: string[];
    description: string;
}

export interface SubscriptionFormErrors {
    name?: string;
    price?: string;
    duration?: string;
    features?: string;
    description?: string;
}

// Dashboard Types
export interface DashboardMetric {
    title: string;
    value: string | number;
    change: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
}

export interface MonthlyRevenue {
    month: string;
    revenue: number;
}

export interface RevenueChartData {
    month: string;
    revenue: number;
}

export interface Activity {
    id: string;
    type: 'user_signup' | 'course_purchase' | 'teacher_joined' | 'company_registered';
    message: string;
    timestamp: Date;
    icon: string;
}

export interface TopCourse {
    title: string;
    sales: number;
    revenue: number;
}

// Order Types
export interface OrderCourse {
    _id: string;
    title: string;
    price: number;
}

export interface CompanyOrder {
    _id: string;
    companyName: string;
    courses: OrderCourse[];
    totalAmount: number;
    status: string;
    createdAt: Date;
}

// Report Types
export interface UserDistributionData {
    name: string;
    value: number;
}

export interface ActiveTeacher {
    name: string;
    courses: number;
    students: number;
    revenue: number;
    transactions: number;
}

// Settings Types
export interface AdminProfile {
    _id?: string;
    name: string;
    email: string;
    role?: string;
    phone?: string;
    avatar?: string;
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface EmailChangeData {
    newEmail: string;
    otp: string;
}

export interface NewAdminData {
    name: string;
    email: string;
    password: string;
}

// Dashboard Stats Types
export interface DashboardStats {
    totalRevenue: number;
    totalStudents: number;
    totalTeachers: number;
    totalCompanies: number;
    totalCourses: number;
}

export interface MonthlyRevenueItem {
    _id: number; // month number
    revenue: number;
}

export interface YearlyRevenueItem {
    _id: number; // year
    revenue: number;
}

export interface RecentActivityItem {
    type: 'purchase' | 'upload' | 'signup' | 'other';
    user: string;
    action: string;
    target: string;
    time: string | Date;
}

export interface DashboardData {
    stats: DashboardStats;
    monthlyRevenue: MonthlyRevenueItem[];
    yearlyRevenue?: YearlyRevenueItem[];
    recentActivity: RecentActivityItem[];
    topCourses?: TopCourse[];
    userDistribution?: UserDistributionData[];
    activeTeachers?: ActiveTeacher[];
}

// Mapped Activity for UI
export interface MappedActivity {
    id: number;
    user: string;
    action: string;
    target: string;
    time: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Transaction Types Extended
export interface TransactionUser {
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
}

export interface TransactionRow {
    _id: string;
    type: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED';
    createdAt: string | Date;
    userId?: TransactionUser;
    teacherId?: TransactionUser;
    companyId?: TransactionUser;
}

// Order Types Extended
export interface PurchasedCourse {
    courseId: {
        title: string;
        _id: string;
    };
    seats: number;
    price: number;
}

export interface CompanyOrderResponse {
    _id: string;
    companyId: {
        email: string;
        name: string;
        _id: string;
    };
    purchasedCourses: PurchasedCourse[];
    amount: number;
    createdAt: string;
}

// Subscription Feature with description
export interface SubscriptionFeatureWithDescription {
    name: string;
    description: string;
}

// Form value types
export type FormFieldValue = string | number | boolean | string[];

// Validation error type
export interface ValidationErrors {
    [key: string]: string;
}

// Teacher Verification
export interface VerificationRequest {
    _id: string;
    name: string;
    email: string;
    about?: string;
    resumeUrl?: string;
    status: string;
}

// Course Management
export interface IAdminCourse {
    _id: string;
    title: string;
    description: string;
    coverImage?: string;
    teacherId?: {
        name: string;
        _id: string;
    };
    totalStudents: number;
    status: string;
    isBlocked: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
    level: string;
    category: string;
    price?: number;
}
