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
}

// Settings Types
export interface AdminProfile {
    name: string;
    email: string;
    role: string;
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
