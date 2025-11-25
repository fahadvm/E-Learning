export interface ITeacher {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    isBlocked: boolean;
    verified: boolean;
    joinDate: string;

    totalCourses: number;
    totalStudents: number;
    totalEarnings: number;
    rating: number;
    reviews: number;

    expertise: string[];
    bio?: string;
}

export interface ITeacherListResponse {
    data: ITeacher[];
    total: number;
}

export interface ITeacherCourse {
    _id: string;
    title: string;
    category: string;
    thumbnail: string;
    price: number;
    rating: number;
    studentsEnrolled: number;
    status: "active" | "draft" | "archived";
}

export interface ITeacherDetails {
    teacher: ITeacher;
    courses: ITeacherCourse[];
}

export interface ITeacherVerificationRequest {
    _id: string;
    teacherId: string;
    name: string;
    email: string;
    avatar?: string;

    submittedAt: string;
    status: "pending" | "approved" | "rejected";

    documents: string[]; // URLs of uploaded proof docs
    rejectionReason?: string;
}

export interface ITeacherVerificationListResponse {
    data: ITeacherVerificationRequest[];
    total: number;
}

