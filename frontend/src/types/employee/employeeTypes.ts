// Employee Profile Types
export interface ILearningCourse {
    courseId: string;
    minutes: number;
}

export interface IEmployeeLearningRecord {
    employeeId: string;
    companyId?: string;
    date: string;
    totalMinutes: number;
    courses: ILearningCourse[];
}

export interface IEmployeeCourseProgress {
    courseId: string;
    percentage: number;
    completedLessons: string[];
    completedModules: string[];
    lastVisitedLesson?: string;
    notes?: string;
}

export interface ICourseProgress {
    courseId: {
        _id: string,
        title: string
    };
    percentage: number;
    completedLessons?: string[];
    totalLesson?: number;
    lastVisitedTime?: string;
}

export interface EmployeeProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    position?: string;
    department?: string;
    profilePicture?: string;
    bio?: string;
    about?: string;
    skills?: string[];
    social_links?: SocialLinks;
    companyId?: string | { _id: string; name: string };
    invitedBy?: string;
    requestedCompanyId?: string | { _id: string; name: string };
    rejectionReason?: string;
    streakCount: number;
    longestStreak?: number;
    lastLoginDate?: Date;
    coursesProgress?: IEmployeeCourseProgress[];
    employeeID?: string;
    joinDate?: string;
    subscription?: boolean;
    coursesAssigned?: string[];
    isActive: boolean;
    isBlocked?: boolean;
    isVerified?: boolean;
    role?: string;
    status?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
    facebook?: string;
}

// Learning Path Types
export interface LearningPathCourse {
    _id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    duration?: number;
    progress?: number;
}

export interface LearningPath {
    _id: string;
    title: string;
    description: string;
    courses: LearningPathCourse[];
    progress?: number;
    status?: 'not-started' | 'in-progress' | 'completed';
    createdAt: Date;
}

export interface PathCourse {
    _id: string;
    courseId: string;
    title: string;
    description?: string;
    duration?: string;
    difficulty: string;
    icon?: string;
    order: number;
}

export interface LearningPathProgress {
    currentCourse: {
        index: number;
        courseId: string;
        percentage: number;
    };
    completedCourses: string[];
    percentage: number;
    status: "active" | "paused" | "completed" | string;
}

export interface AssignedLearningPath {
    _id: string;
    learningPathId: {
        _id: string;
        title: string;
        icon?: string;
        category?: string;
        description?: string;
        courses?: { courseId: string }[];
    };
    percentage: number;
    completedCourses?: string[];
    currentCourse?: {
        index: number;
        courseId: string;
        percentage: number;
    };
    status?: string;
}

export interface LearningPathDetail {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
    category?: string;
    icon?: string;
    courses: PathCourse[];
    progress: LearningPathProgress;
}

// Company Types
export interface CompanyInvitation {
    _id: string;
    name: string;
    logo?: string;
    industry?: string;
    email?: string;
}

export interface CompanySearchResult {
    _id: string;
    name: string;
    logo?: string;
    industry?: string;
    size?: string;
    location?: string;
    description?: string;
    email?: string;
}

export interface RequestedCompany {
    _id: string;
    name: string;
}

export interface INotification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export interface ILesson {
    _id: string;
    title: string;
    content?: string;
    videoUrl?: string; // teacher side usually uses videoUrl
    videoFile?: string; // student side seems to use videoFile
    duration?: number;
    description?: string;
    completed?: boolean;
}

export interface IModule {
    _id: string;
    title: string;
    description?: string;
    lessons: ILesson[];
    completed?: boolean;
}

export interface ICourse {
    _id: string;
    title: string;
    description: string;
    level?: string;
    category: string;
    price?: string;
    coverImage?: string;
    thumbnail?: string;
    language?: string;
    modules?: IModule[];
    instructorId?: string | { name: string; _id: string; email: string; about: string; profilePicture: string };
    teacherId?: { _id: string; name: string; email: string; about: string; profilePicture: string }; // Alias/usage in some pages
    totalDuration: number;
    totalStudents?: number;
    reviews?: { rating: number }[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ICourseDetailsResponse {
    course: ICourse;
    progress: IEmployeeCourseProgress;
}


export interface ICourseComment {
    _id: string;
    courseId: string;
    userId: { _id: string; name: string; profilePicture?: string };
    content: string;
    createdAt: string;
}

export interface ICourseResource {
    _id: string;
    courseId: string;
    title: string;
    url: string;
    type: string;
    size?: string;
    createdAt: string;
}

// Component Props Types
export interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}

export interface InfoCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle?: string;
    link?: string;
}

export interface ContactFieldProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    editable: boolean;
    onChange?: (value: string) => void;
    error?: string;
}

export interface SocialFieldProps {
    icon: React.ReactNode;
    platform: string;
    url: string;
    editable: boolean;
    onChange?: (value: string) => void;
    error?: string;
}

export interface SettingsButtonProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    onClick: () => void;
    error?: string;
}

// Google Login Types
export interface GoogleUser {
    email: string;
    name: string;
    picture?: string;
    sub: string;
}

export interface GoogleCredentialResponse {
    credential: string;
    select_by?: string;
}
