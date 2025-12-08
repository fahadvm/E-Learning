export interface IStudent {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    isBlocked: boolean;
    joinDate: string;
    coursesCount: number;
    totalSpent: number;
}

export interface IStudentListResponse {
    data: {
        data: IStudent[];
        total: number;
    }
}


export interface ICourseProgress { courseId: string; completedLessons: string[]; completedModules: string[]; percentage: number; lastVisitedLesson?: string; notes: string;updatedAt:string ;}


export interface IStudentQuery {
    page: number;
    limit: number;
    search: string;
    status: "all" | "active" | "blocked";
}





export interface IPurchase {
    id: string;
    date: string;
    courseName: string;
    amount: number;
    status: string;
    invoiceId: string;
}

export interface IStudentDetails {
    _id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    activePlan?: string;
    status: "active" | "blocked";
    verified: boolean;
    joinDate: string;
    notes?: string;

    coursesEnrolled: number;
    totalSpent: number;

    courses: ICourseProgress[];
    purchases: IPurchase[];
    coursesProgress: ICourseProgress[]
}
