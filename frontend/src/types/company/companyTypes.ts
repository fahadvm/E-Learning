// Company Profile Types
export interface CompanySocialLinks {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
}

export interface CompanyProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    address?: string; // Added to match usage
    companyCode?: string; // Added to match usage
    isVerified?: boolean; // Added match usage
    website?: string;
    pincode?: string;
    about?: string;
    industry?: string;
    size?: string;
    description?: string;
    logo?: string;
    social_links?: CompanySocialLinks;
    subscription?: {
        plan: string;
        status: string;
        expiresAt: Date;
    };
    employees?: Employee[];
    courses?: CompanyCourse[];
    createdAt: Date;
    updatedAt: Date;
}

// Employee Types
export interface Employee {
    _id: string;
    name: string;
    email: string;
    role?: string;
    department?: string;
    joinedAt: Date;
    profilePicture?: string;
    isActive: boolean;
    position?: string;
}

export interface EmployeeRequest {
    _id: string;
    email: string;
    name: string;
    department?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}

// Course Types
export interface CompanyCourse {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    instructor?: string;
    duration?: number;
    level?: string;
    category?: string;
    enrolledCount?: number;
    completionRate?: number;
}

// Tracker Types
export interface TrackerStats {
    totalEmployees: number;
    totalLearningHours: number;
    avgCompletionRate: number;
    totalCourses: number;
    graph: TrackerGraphData[];
    mostActive: LearnerActivity[];
    leastActive: LearnerActivity[];
}

export interface TrackerGraphData {
    label: string;
    hours: number;
}

export interface LearnerActivity {
    id: string;
    name: string;
    hours: number;
    progress: number;
}

// Leaderboard Types
export interface LeaderboardUser {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    totalPoints: number;
    coursesCompleted: number;
    rank: number;
    hours: number;
    courses: number;
    streak: number;
    isYou?: boolean;
}

// Form Error Types
export interface FormErrors {
    [key: string]: string | FormErrors;
}

export interface UpdateEmployeeDTO {
    position?: string;
    department?: string;
    location?: string;
}

// ================= PROFILE UPDATE =================
export interface UpdateCompanyProfileDTO {
    name: string;
    phone?: string;
    website?: string;
    about?: string;
    address: string;
    pincode: string;
    social_links?: {
        linkedin?: string;
        instagram?: string;
        twitter?: string;
    };
    profilePicture?: string; 
}

export type VerifyCompanyProfilePayload = FormData;


