// Employee Profile Types
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
    skills?: string[];
    social_links?: {
        linkedin?: string;
        twitter?: string;
        github?: string;
    };
    companyId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
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

// Company Types
export interface CompanyInvitation {
    _id: string;
    companyId: {
        _id: string;
        name: string;
        logo?: string;
        industry?: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
}

export interface CompanySearchResult {
    _id: string;
    name: string;
    logo?: string;
    industry?: string;
    size?: string;
    location?: string;
    description?: string;
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
