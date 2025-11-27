export interface ITeacher {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    isBlocked: boolean;
    verified: boolean;
    joinDate: string;
    resumeUrl:string

    totalCourses: number;
    totalStudents: number;
    totalEarnings: number;
    rating: number;
    reviews: number;

    skills: string[];
    bio?: string;
}

export interface ITeacherListResponse {
    data:{
        data: ITeacher[];
        total: number;
    }
}

export interface ITeacherCourse {
    _id: string;
    title: string;
    category: string;
    thumbnail: string;
    price: number;
    rating: number;
    totalStudents: number;
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
    resumeUrl:string
    isBlocked:boolean

    submittedAt: string;
    verificationStatus: "pending" | "approved" | "rejected";

    documents: string[]; // URLs of uploaded proof docs
    rejectionReason?: string;
}

export interface ITeacherVerificationListResponse {
   data:{ data: ITeacherVerificationRequest[];
    total: number;}
}

